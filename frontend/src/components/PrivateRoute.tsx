import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const PrivateRoute = () => {

  const { userInfo } = useAppSelector((state) => state.authSlice);

//Replace here is to replace any past history
  return userInfo?._id? <Outlet/> : <Navigate to='/login' replace />
}

export default PrivateRoute