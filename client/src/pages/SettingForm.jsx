import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";

import "../styles/settingForm.css"

const SettingsForm = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  const [form, setForm] = useState({
    oldPassword: "",

    newPassword: "",
  });
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleProfile = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await API.put("/users/update", form);

      toast.success("Profile updated successfully!");
      

    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/users/updateProfile", profile);
      
      

      toast.success(res.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => {
            // navigate("/login");'
            // window.location.reload("/");
            window.location.href = "/";

        }, 2000);



    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating profile");

    }


  }

  return (
    <div className="modals">
      <div className="modal-contents">
        <h2>Update Profile</h2>

        <form className="kform" onSubmit={handleSave}>
          <input
            type="text"
            name="name"
            placeholder="name"
            value={profile.name}
            onChange={handleProfile}
          // required
          />
          <input
            type="email"
            name="email"
            placeholder="email"
            value={profile.email}
            onChange={handleProfile}
          // required
          />
          <button id="s-button" type="submit">Save</button>
          {/* <button id="s-button1"type="button" onClick={() => navigate("/")}>
            Cancel
          </button> */}
        </form>
      </div>
      <div className="modal-contents">
        <h2>Update Password</h2>

        <form className="kform" onSubmit={handleSubmit}>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          <button id="s-button" type="submit">Save</button>
          {/* <button id="s-button1"type="button" onClick={() => navigate("/")}>
            Cancel
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
