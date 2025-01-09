import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axois from '../config/axois';
import {initializeSocket ,receiveMessage ,sendMessage} from '../config/socket.js'

function Project() {
  const location = useLocation();
  const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  const [ project, setProject ] = useState(location.state.project)
  const [ selectedUserId, setSelectedUserId ] = useState(new Set()) // Initialized as Set
  const [ users, setUsers ] = useState([]);
  const token = localStorage.getItem("SOENtoken");
 

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
    
  };

  const addCollaborators = () => {
    axois
      .put(
        '/project/add-user',
        {
          projectId: project._id,
          users: Array.from(selectedUserId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  useEffect(()=>{

    initializeSocket();

    axois.get('/user/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res)=>{
     setUsers(res.data.users);
    }).catch((err)=>{
      console.log(err)
    })

    axois.get(`/project/${project._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res)=>{
      setProject(res.data);
    }).catch((err)=>{
      console.log(err)
    })
  },[])

  return (
    <main className="h-screen w-screen flex">
      <section className="sec-left relative h-full min-w-80  flex flex-col bg-slate-300">
        <header className="flex justify-between items-center p-3 px-4 w-full bg-slate-100">
          <button className="flex items-center gap-2 " onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill"></i>
            <p className="text-sm font-semibold">Add Collaborator</p>
          </button>
          <button
            onClick={() => {
              setIsSidePanelOpen(!isSidePanelOpen);
            }}
            className="py-2 px-3 rounded-full bg-slate-300"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>
        <div className="conversation-area flex-grow flex flex-col">
          <div className="message-box flex-grow flex flex-col gap-1 p-1">
            <div className="incoming max-w-52 flex flex-col p-2 bg-slate-50 rounded-md shadow w-fit">
              <h5 className="text-gray-500 text-xs font-medium">
                example@gmail.com
              </h5>
              <p className="text-sm font-semibold text-black">Hello</p>
            </div>
            <div className="ml-auto max-w-52 flex flex-col p-2 bg-slate-50 rounded-md shadow w-fit">
              <h5 className="text-gray-500 text-xs font-medium">
                example@gmail.com
              </h5>
              <p className="text-sm font-semibold text-black">Hello</p>
            </div>
          </div>
          <div className="inputField flex w-full">
            <input
              className="p-2 px-4 border-none outline-none w-[83%]"
              type="text"
              placeholder="Enter Message"
            />
            <button className="p-3 px-4 bg-slate-400 text-xl w-[17%]">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute left-0 transform ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0 transition-transform duration-300`}
        >
          <header className="flex  justify-between items-center bg-slate-200">
            <h1 className=" font-semibold px-4">Collaborates</h1>
            <button
              className="close-fil text-lg p-3 px-5 rounded-full"
              onClick={() => setIsSidePanelOpen(false)}
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-2 ">
            
            {project.users.map((user)=>{
                return <div className="user cursor-pointer flex gap-2 p-2 items-center hover:bg-slate-300">
                <div className="aspect-square rounded-full p-1 px-2 w-fit h-fit flex items-center justify-center bg-slate-400">
                  <i className="ri-user-fill"></i>
                </div>
                <h1  className="font-semibold text-sm">{user.email}</h1>
              </div>
              })}
            
          </div>
        </div>
      </section>
    
      {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div key={user.id} className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={()=>addCollaborators()}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
    </main>
  );
}

export default Project;