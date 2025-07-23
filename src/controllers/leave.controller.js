import holidayService from "../services/holiday.service.js";
import leaveService from "../services/leave.service.js";
import createError from "../utils/create-error.util.js";
const leaveController = {
    getAllLeaves: async (req, res) => {
        const leavedata = await leaveService.GetAllLeave()
        res.json(leavedata)
    },
    getUserLeaves: async (req, res) => {
        const leavedata = await leaveService.GetUserLeave(req.user.id)

        res.json(leavedata)
    },
    getLeavesDetails: async (req, res) => {
        const leaveRequestId = req.params.id
        const userId = req.user.id
        const userRole = req.user.role
        const leavedetails = await leaveService.GetLeaveDetails(leaveRequestId)
        if (!leavedetails) {
            createError(400, "ไม่พบข้อมูล")
        }
        if ((userRole !== 'HR') && (userId !== leavedetails.userId)) {
            createError(403, "ไม่มีสิทธิ์ดูขข้อมูลนี้")
        }
        res.json(leavedetails)
    },
    createLeavesRequests: async (req, res) => {
        const userId = req.user.id
        const { startDate, endDate, leaveType, reason } = req.body
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        const holidayFound = await holidayService.checkIfOnHoliday(newStartDate, holidayFound)
        const totalLeaveDays = calculateLeaveDays(newStartDate, newEndDate);
        if (totalLeaveDays <= 0) {
            return res.status(400).json({ message: "จำนวนวันลาที่คำนวณได้ต้องมากกว่า 0" });
        }
        if (holidayFound) {
            return res.status(400).json({
                message: "ไม่สามารถสร้างว้นลาตรงกับวันหยุดพิเศษได้"
            });
        }
        const leaveYear = newStartDate.getFullYear();
        const entitlement = await entitlementService.checkBalance(userId, totalLeaveDays, leaveType, leaveYear);
        const overlappingLeave = await leaveService.CheckOverLaptime(userId, newStartDate, newEndDate)
        if (overlappingLeave) {
            return res.status(409).json({
                message: "คุณส่งคำขอวันลาซ้ำ",
                details: {
                    overlappingId: overlappingLeave.id,
                    overlappingStartDate: overlappingLeave.startDate,
                    overlappingEndDate: overlappingLeave.endDate
                }
            });
        }
        const result = await prisma.$transaction(async (tx) => {
                const newLeaveRequest = await leaveService.createLeaveRequest({
                    startDate: newStartDate,
                    endDate: newEndDate,
                    leaveDay: totalLeaveDays,
                    leaveType,
                    reason,
                    userId
                }, tx);

                await entitlementService.deductFromBalance(entitlement.id, totalLeaveDays, tx);

                return newLeaveRequest;
            });

            res.status(201).json({
                message: "สร้างใบลาสำเร็จ",
                data: result,
            });

    },
     updateLeaveStatus: async (req, res, next) =>  {
            
              const leaveRequestId = req.params.id
            const { status } = req.body;

        
            const leaveRequest = await leaveService.getLeaveDetails(leaveRequestId); 
            if (!leaveRequest) {
                return res.status(400).json({ message: "ไม่พบใบคำขอลานี้" });
            }

            if (leaveRequest.status !== 'PENDING') {
                return res.status(400).json({ message: `ใบคำขอนี้ถูก ${leaveRequest.status.toLowerCase()} ไปแล้ว` });
            }

    
            if (status === 'REJECTED') {
            
                await prisma.$transaction(async (tx) => {
                
                    await leaveService.updateStatus(leaveId, 'REJECTED', tx); // ใช้ Service
                    await entitlementService.refundBalance( 
                        leaveRequest.userId,
                        leaveRequest.leaveType,
                        leaveRequest.startDate.getFullYear(),
                        leaveRequest.leaveDay,
                        tx
                    );
                });
                await tx.auditLog.create({
                        data: {
                            action: 'REJECT',
                            relatedTable: 'LeaveRequest',
                            relatedId: leaveId,
                            detail: `Leave request rejected by user ID: ${userPerformingAction.id}`,
                            userId: userPerformingAction.id
                        }
                    });
               return res.status(200).json({ message: "ปฏิเสธใบคำขอลา และทำการคืนโควต้าวันลาเรียบร้อยแล้ว" });

            }  else { 
                const updatedLeaveRequest = await prisma.$transaction(async (tx) => {
                    const leave = await leaveService.updateStatus(leaveId, 'APPROVED', tx);
                    await tx.auditLog.create({
                        data: {
                            action: 'APPROVE',
                            relatedTable: 'LeaveRequest',
                            relatedId: leaveId,
                            detail: `Leave request approved by user ID: ${userPerformingAction.id}`,
                            userId: userPerformingAction.id
                        }
                    });
                    return leave;
                });
                
                return res.status(200).json({ message: "อนุมัติใบคำขอลาเรียบร้อยแล้ว", data: updatedLeaveRequest });
            }

        }
};

export default leaveController;
