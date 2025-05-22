import React,{useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";

const PromoHeader = () => {


    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const modalStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: 600,
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
      maxHeight: "90vh",
      overflowY: "auto",
    };
    return (

        <>
<div className="bg-gradient-to-r from-[#65a2ed] via-[#c7e1fd] to-[#60a2f3] text-black px-6 sm:px-12 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-center sm:text-left text-sm sm:text-base font-medium tracking-wide animate-pulse">
            Reward your smile. <span className="font-bold">Get a $50 Mastercard.</span>
          </p>
          <button
            onClick={handleOpen}
            className="bg-white text-[#60a2f3] font-semibold px-5 py-1.5 rounded-full shadow hover:bg-indigo-100 transition duration-300"
          >
            See How
          </button>
        </div>
      </div>

<Modal open={open} onClose={handleClose}>
<Box sx={modalStyle}>
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="h6" fontWeight={600}>
      How to Claim Your $50 Gift Card 🎁
    </Typography>
    <IconButton onClick={handleClose}>
      <CloseIcon />
    </IconButton>
  </Box>

  <Typography sx={{ mt: 2 }} component="div">
    <p><strong>Hi there!</strong></p>
    <p>Thanks for using <strong>dentistnearme.ai</strong> to request your appointment! Here’s more info on our gift card promotion.</p>

    <p>You’re eligible for a <strong>$50 gift card</strong> once you complete your appointment and get an exam + treatment done. A cleaning can count as treatment.</p>

    <p>💡 <em>Please note: Gift cards are issued by us (DentistNearMe.ai), not the clinic.</em></p>

    <strong>How to claim your reward:</strong>
    <ul>
      <li>Confirm your appointment – If you haven’t already confirmed a date/time with the clinic, please reach out to them directly to schedule.</li>
      <li>Show up to your appointment and collect your account statement/receipt.</li>
      <li>Reply to this email with the receipt attached.</li>
    </ul>

    <p>Our rewards team will issue your gift card within <strong>3 business days</strong> via email. Choose from 70+ popular brands or a VISA/Mastercard prepaid card you can use anywhere!</p>

    <p>If you have any questions or need help, feel free to reply to this email!</p>

    <p>Keep smiling,</p>
    <p><strong>DentistNearMe.ai Team</strong></p>
  </Typography>

  <Box mt={3} textAlign="right">
    <Button onClick={handleClose} variant="contained" color="primary">
      Got it!
    </Button>
  </Box>
</Box>
</Modal>
</>
  
    );
  };
  
  export default PromoHeader;
  