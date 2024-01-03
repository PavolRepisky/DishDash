import { Box } from "@mui/material";

interface BlurredEdgeImageProps {
  background: string,
  imageSrc: string,
  imageAlt: string,
  sx?: object
}

const BlurredEdgeImage = ({ background, imageSrc, imageAlt, sx}: BlurredEdgeImageProps) => {
  return (
    <Box component="image" sx={{
      ...sx,
      display: "block", 
      position: "relative",
      "&::before": {
        display: "block",
        content: '""',
        position: "absolute",
        width: "100%",
        height: "100%",
        boxShadow: `inset 0px 0px 10px 20px ${background}`
      }  
    }}>
      <img
        src={imageSrc}
        alt={imageAlt}
        style={{ 
          width: "100%", 
          height: "auto"
        }}
      />
    </Box>
  );
};

export default BlurredEdgeImage;