import React, { useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";

const SettingsForm = ({ onclose }) => {
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
      onclose(); 
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Update</button>
          <button type="button" onClick={onclose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
