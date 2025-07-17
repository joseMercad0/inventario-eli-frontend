import { FaTh, FaRegChartBar, FaCommentAlt, FaHistory } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { FcSalesPerformance } from "react-icons/fc";
import { LuFileSearch } from "react-icons/lu";



const menu = [
  {
    title: "Pantalla",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "Agregar Producto",
    icon: <BiImageAdd />,
    path: "/add-product",
  },
  {
    title: "Cuenta",
    icon: <FaRegChartBar />,
    childrens: [
      {
        title: "Perfil",
        path: "/profile",
      },
      {
        title: "Editar Perfil",
        path: "/edit-profile",
      },
    ],
  },
  {
    title: "Historial",
    icon: <FaHistory />, // Necesitas importar este icono arriba
    path: "/history",
  },
    {
    title: "Ventas",
    icon: <FcSalesPerformance />,
    path: "/ventas"
  },
    {
    title: "informes",
    icon: <LuFileSearch />,
    path: "/informes"
  },
  {
    title: "Contactar",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
];

export default menu;
