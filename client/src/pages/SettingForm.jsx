import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";

import "../styles/settingForm.css"

const SettingsForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    oldPassword: "",

    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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

  return (
    <div className="modals">
      <div className="modal-contents">
        <h2>Update Profile</h2>
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
          <button id="s-button" type="submit">Update</button>
          <button id="s-button1"type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
