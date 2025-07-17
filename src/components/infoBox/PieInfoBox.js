import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import "./PieInfoBox.scss"; // Si deseas un archivo scss específico, o agrega el SCSS abajo a tu ProductSummary.scss

const PieInfoBox = ({ icon, title, value, total, color, bgColor }) => {
  const data = [
    { name: title, value: Number(value) },
    { name: "restante", value: Math.max(total - value, 0) }
  ];
  return (
    <div className={`info-box pie-info-box ${bgColor || ""}`}>
      <div className="info-box-icon">{icon}</div>
      <div className="pie-chart-wrapper">
        <PieChart width={64} height={64}>
          <Pie
            data={data}
            cx={32}
            cy={32}
            innerRadius={22}
            outerRadius={30}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell key="value" fill={color || "#4d62d9"} />
            <Cell key="restante" fill="#f1f3fa" />
          </Pie>
        </PieChart>
        <div className="pie-label">{value}</div>
      </div>
      <div className="info-box-details">
        <span className="info-box-title">{title}</span>
      </div>
    </div>
  );
};

export default PieInfoBox;
