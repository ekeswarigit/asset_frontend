import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid
} from "@mui/material";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewAsset = ({ open, onClose, data }) => {

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}
  transitionDuration={400}>
      
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Asset Details
      </DialogTitle>

      <DialogContent dividers>
        {data ? (
          <Grid container spacing={2}>

            <Grid item xs={6}>
              <Typography><b>Name:</b> {data.assetName}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><b>Brand:</b> {data.brand}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><b>Status:</b> {data.status}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><b>Condition:</b> {data.assetCondition}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><b>Type:</b> {data.assetTypeName}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><b>Serial:</b> {data.serialNumber}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><b>Model:</b> {data.model}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><b>Cost:</b> ₹{data.cost}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><b>Purchase:</b> {data.purchaseDate}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><b>Warranty:</b> {data.warrantyExpiry}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography><b>Notes:</b> {data.notes}</Typography>
            </Grid>

          </Grid>
        ) : (
          <Typography>No Data</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default ViewAsset;