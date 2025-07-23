import leaveService from "../services/leave.service.js";
import createError from "../utils/create-error.util.js";

const leaveController = {
    getAllLeaves: async (req, res) => {
        const leavedata = await leaveService.GetAllLeave()
        res.json({ leavedata })
    },
    getUserLeaves: async (req, res) => {
        const leavedata = await leaveService.GetUserLeave(req.user.id)

        res.json({ leavedata })
    },
    getLeavesDetails: async (req, res) => {
        const leaveRequestId = req.params.id
        const userId = req.user
        const leavedetails = await leaveService.GetLeaveDetails(leaveRequestId)
        if (!leavedetails) {
            createError(400, "ไม่พบข้อมูล")
        }
    },
    createLeavesRequests: async (req, res) => {
        const userId = req.user
        const { startDate, endDate, leaveType, reason } = req.body
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        const overlappingLeave = await leaveService.CheckOverLaptime(userId,newStartDate,newEndDate)
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
        const newLeaveRequest  = {
            startDate:startDate,
            endDate:endDate,
            leaveType:leaveType,
            reason:reason,
            userId:userId
        }
        await leaveService.CreateNewLeavesRequest(newLeaveRequest) 
        res.status(201).json({message:"สร้างวันลาสำเร็จ"})
        
    }
    
};

export default leaveController;
