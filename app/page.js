"use client";

import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { firestore } from "@/firebase.js";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
  gap: 3,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [filteredPantry, setFilteredPantry] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState("");
  const [search, setSearch] = useState("");

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    if (search === "") {
      setFilteredPantry(pantry);
    } else {
      const filtered = pantry.filter((item) =>
        item.name.toLowerCase().startsWith(search.toLowerCase())
      );

      setFilteredPantry(filtered);
    }
  }, [search, pantry]);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }

    await updatePantry();
  };

  const incrementItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    }

    await updatePantry();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems={"center"}
      flexDirection="column"
      gap={2}
    >
      <Typography variant={"h2"}>Pantry App</Typography>
      <TextField
        label="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></TextField>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width={"100%"} direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="item name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box>
        <Stack spacing={2} overflow={"auto"} width={"350px"} padding={2}>
          {filteredPantry.map(({ name, count }) => (
            <Stack
              key={name}
              direction={"row"}
              spacing={2}
              justifyContent={"space-between"}
              alignItems={"space-between"}
            >
              <Box
                key={name}
                width={"100%"}
                display="flex"
                justifyContent="start"
                alignItems={"center"}
              >
                <Typography variant={"h6"}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
              </Box>
              <Box display={"flex"} gap={1}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  <Typography variant="h4">-</Typography>
                </Button>
                <Box
                  width={"60px"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  border={"1px solid gray"}
                >
                  {count}
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => {
                    incrementItem(name);
                  }}
                >
                  <Typography variant="h4">+</Typography>
                </Button>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
