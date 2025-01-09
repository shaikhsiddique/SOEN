import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import "remixicon/fonts/remixicon.css";
import axois from "../config/axois.js";
import {useNavigate} from 'react-router-dom'

function Home() {
  const { user, setUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setproject] = useState([])
  const token = localStorage.getItem("SOENtoken");
  const navigate = useNavigate();

  useEffect(() => {
    axois
      .get("/project/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setproject(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const createProject = (e) => {
    e.preventDefault();

    axois
      .post(
        "/project/create",
        { name: projectName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Create Project", response.data);
      })
      .catch((error) => {
        console.error("Error creating project", error);
      });
  };

  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-3 ">
        <button
          onClick={() => setIsModalOpen(true)}
          className="project flex items-center justify-center p-4 border border-slate-300 rounded-md 
      hover:border-slate-400 bg-gray-50 font-medium"
        >
          <p className="px-2"> New Project</p>
          <i className="ri-link"></i>
        </button>
        {project.map((project)=>{
          return <div key={project._id} onClick={()=>{navigate('/project',{
            state:{project}
          })}} className="project p-4 border cursor-pointer rounded-lg flex flex-col items-center gap-2 hover:bg-gray-200
            min-w-24 ">
             <h2 className="font-semibold"> {project.name}
             </h2>
             <div className="flex items-center ">
             
              <small className="px-1 font-semibold">Collaborator :</small>
              {project.users.length}
              <i className="ri-user-line"></i>
             </div>
          </div>
        })}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create a new project
                </h3>
                <div className="mt-2">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Project name"
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={(e) => {
                    setIsModalOpen(false);
                    createProject(e);
                  }}
                >
                  Create
                </button>
                <button
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
