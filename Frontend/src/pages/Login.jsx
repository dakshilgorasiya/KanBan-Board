import { useState } from "react";
import { setUser } from "../store/features/authSlice";
import { useDispatch } from "react-redux";

function Login() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);

    // call api and then store response in redux
    const dummyResponse = {
      email: "a@gmail.com",
      userName: "a",
      isAdmin: true,
    };

    dispatch(setUser(dummyResponse));
  };

  return (
    <>
      <div className="flex w-full h-screen justify-center items-center">
        <div className="mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white h-max w-80">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mt-6"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mt-10 cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
