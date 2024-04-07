import { useEffect, useState } from "react";
import "./App.css";
import { Box, Checkbox, Divider } from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import axios from "axios";
const base_url = import.meta.env.VITE_BASE_URL;

function App() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [tasks, setTasks] = useState([]);
  const refreshData = async () => {
    try {
      const config = {
        method: "GET",
        url: `${base_url}/api/v1/getTasks`,
      };
      const { data } = await axios.request(config);
      setTasks(data.tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    refreshData();
  }, []);

  const [inputValue, setInputValue] = useState("");

  async function handleKeyPress(event) {
    let newTask = {
      taskDetail: event.target.value,
      isCompleted: false,
      isDeleted: false,
    };
    if (event.key === "Enter" || event.keyCode === 13) {
      const config = {
        method: "POST",
        url: `${base_url}/api/v1/insertTask`,
        data: {
          task: newTask,
        },
      };
      await axios.request(config);
      refreshData();
      setInputValue("");
    }
  }
  async function deleteTask(taskId) {
    try {
      const config = {
        method: "PUT",
        url: `${base_url}/api/v1/updateTask/${taskId}`,
        data: {
          isDeleted: true,
        },
      };
      await axios.request(config);
      refreshData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function clearCompletedTasks() {
    try {
      const config = {
        method: "PUT",
        url: `${base_url}/api/v1/bulkDeleteTasks`,
      };
      await axios.request(config);
      refreshData();
    } catch (err) {
      console.log(err)
    }
  }
  async function handleCheckBox(event, taskId) {
    try {
      const config = {
        method: "PUT",
        url: `${base_url}/api/v1/updateTask/${taskId}`,
        data: {
          isCompleted: event.target.checked,
        },
      };
      await axios.request(config);
      refreshData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "40%",
        }}
      >
        <Box>
          <h1>What do you want to do today?</h1>
        </Box>
        <Box
          sx={{
            width: "100%",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <input
            placeholder="Add To-Dos..."
            className="wide-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={(e) => handleKeyPress(e)}
          ></input>
        </Box>
        <Box sx={{ width: "100%", marginBottom: "1rem" }}>
          {tasks.map((task) => {
            return (
              <Box key={task.id}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: ".5rem",
                    paddingTop: ".5rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Checkbox
                      {...label}
                      defaultChecked={task.isCompleted}
                      color="default"
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 17 } }}
                      onChange={(e) => handleCheckBox(e, task.id)}
                    />
                    <Box
                      sx={{
                        textDecoration: task.isCompleted
                          ? "line-through"
                          : "none",
                        fontSize: "1.4rem",
                      }}
                    >
                      {task.taskDetail}
                    </Box>
                  </Box>
                  <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => deleteTask(task.id)}
                  >
                    <BackspaceOutlinedIcon />
                  </Box>
                </Box>
                <Divider
                  sx={{
                    height: 1,
                    width: "100%",
                    margin: "20px 0",
                    backgroundColor: "transparent", // Set background color to transparent
                    border: "none",
                    borderTop: "1px dotted #ccc", // Set dotted border style
                    "&.MuiDivider-root": {
                      margin: 0,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box>
            {`${
              tasks.filter(
                (task) => task.isCompleted === false && task.isDeleted === false
              )?.length
            } tasks left`}
          </Box>
          <Box sx={{ cursor: "pointer" }} onClick={clearCompletedTasks}>
            {`Clear ${
              tasks.filter(
                (task) => task.isCompleted === true && task.isDeleted === false
              )?.length
            } completed task(s)`}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
