import { Container, Card, CardContent, Fab, Grid, Box, CardMedia, IconButton, useTheme } from "@mui/material";
import { AddPhotoAlternate as AddPhotoAlternateIcon, Delete as DeleteIcon } from "@mui/icons-material";

import React from "react";

interface ImagePickerProps {
  items: string[];
  setItems: (value: React.SetStateAction<string[]>) => void
}

const ImagePicker = ({items, setItems}: ImagePickerProps) => {
  const theme = useTheme();

  const handleAddItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newItem = event.target.files?.[0];

    if (!newItem) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(newItem);
    reader.onloadend = () => {
      setItems((prevItems) => {
        return [...prevItems, reader.result as string]
      });
    };
  };

  const handleDeleteItem = (_: React.MouseEvent<HTMLButtonElement>, i: number) => {
    setItems((prevItems) => {
      return prevItems.filter((_, index) => index !== i)
    });
  };

  console.log(items);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        mt: 2,
        mx: 0,
        width: "100%",
        height: "150px",
        xs: {
          height: "auto"
        }
      }}
    >
      <Grid container spacing={0} sx={{ 
        height: "100%", 
        m: 0
        }}
      >

        {items.map((x, i) =>
          <Grid key={`img-${i}`} item xs={12} md={2} p={1}
            sx={{
              "&:first-child": {
                paddingLeft: 0
              },
              "&:last-child": {
                paddingRight: 0
              }
            }}
          >

            <Card sx={{height: "100%", position: "relative", p: 0, boxShadow: 2}}>
              <CardMedia 
                component="img"
                height="134"
                image={x}
                sx={{
                  overflow: "hidden",
                  objectFit: "cover"
                }}
              />
              <IconButton                  
                sx={{
                    background: `${theme.palette.primary.main}`,
                    boxShadow: 1,
                    color: "white",
                    width: 30,
                    height: 30,
                    position: "absolute",
                    top: 3,
                    right: 3,
                    "&:hover": {
                      background: `${theme.palette.error.dark}`
                    }
                  }}
                  onClick={(e) => handleDeleteItem(e, i)}
                >
                <DeleteIcon />
              </IconButton>

            </Card>

          </Grid>
        )}

        { items.length < 6 && 
        <Grid item xs={12} md={2} p={1} sx={{
          "&:first-child": {
            paddingLeft: 0
          },
          "&:last-child": {
            paddingRight: 0
          }
        }}>

          <Card sx={{height: "100%", p: 0, boxShadow: 2}}>
            <CardContent sx={{ 
              height: "100%", 
              p: 0,
              "&:last-child": {
                paddingBottom: 0
                } 
              }}>
                <Box display={"flex"} sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%"
                }}
                >
                  <input
                    accept="image/jpeg,image/png,image/tiff,image/webp"
                    id="contained-button-file"
                    name="logo"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleAddItem}
                  />
                  <label
                    htmlFor="contained-button-file"
                  >
                    <Fab component="span" sx={{
                      background: `${theme.palette.primary.main}`,
                      color: `${theme.palette.secondary.main}`,
                      "&:hover": {
                        background: `${theme.palette.primary.dark}`  
                      }
                    }}>
                      <AddPhotoAlternateIcon />
                    </Fab>
                  </label>
                </Box>

            </CardContent>
          </Card>

        </Grid> }
      </Grid>
    </Container>
  
    )
};

export default ImagePicker;