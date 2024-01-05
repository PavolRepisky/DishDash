import { Box } from "@mui/material";


interface ImageObject {
  imageUrl: string;
  imageAlt: string;
}

interface CarouselImageItemProps {
  images: Array<ImageObject>;
  numberOfImages: 1 | 2 | 3;
  sx?: Object;
}


const CarouselImageItem = ({ images, numberOfImages, sx }: CarouselImageItemProps) => {

  return (
    <Box sx={{
      height: "300px",
      display: "flex",
      flexDirection: "row",

    }}>
      { numberOfImages === 3 && 
      <>
        <img src={images[0].imageUrl} alt={images[0].imageAlt} style={{              
          width: "33.3%",
          height: "100%",
          objectFit: "cover", 
        }}/>
        <img src={images[1].imageUrl} alt={images[1].imageAlt} style={{              
          width: "33.3%",
          height: "100%",
          objectFit: "cover", 
        }}/>
        <img src={images[2].imageUrl} alt={images[2].imageAlt} style={{              
          width: "33.3%",
          height: "100%",
          objectFit: "cover", 
        }}/>
      </>}
      {
        numberOfImages === 1 &&

          <img src={images[0].imageUrl} alt={images[0].imageAlt} style={{   
            ...sx,           
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}/>

      }

    </Box>
  )
}

export default CarouselImageItem;