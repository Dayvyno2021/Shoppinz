import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const AdminRoute = () => {

  const { userInfo } = useAppSelector((state) => state.authSlice);

//Replace here is to replace any past history
  return userInfo?._id && userInfo?.isAdmin? <Outlet/> : <Navigate to='/' replace />
}

export default AdminRoute;