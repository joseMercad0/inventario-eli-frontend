import React, { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./sales.scss";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SalesChart = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("diario");
  const [selectedDay, setSelectedDay] = useState("");
  const [allDays, setAllDays] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${BACKEND_URL}/api/sales`, { withCredentials: true });
      const sales = res.data;
      const grouped = {};

      if (range === "porhora" && selectedDay) {
        sales
          .filter(sale => new Date(sale.date).toLocaleDateString() === selectedDay)
          .forEach(sale => {
            const date = new Date(sale.date);
            const hour = date.getHours().toString().padStart(2, "0") + ":00";
            grouped[hour] = (grouped[hour] || 0) + sale.total;
          });
        setData(
          Array.from({ length: 24 }, (_, i) => {
            const h = i.toString().padStart(2, "0") + ":00";
            return { fecha: h, total: grouped[h] || 0 };
          })
        );
      } else {
        sales.forEach(sale => {
          let key = "";
          const date = new Date(sale.date);
          if (range === "diario") key = date.toLocaleDateString();
          if (range === "mensual") key = date.getMonth() + 1 + "/" + date.getFullYear();
          if (range === "semanal") key = getWeekNumber(date) + "/" + date.getFullYear();
          grouped[key] = (grouped[key] || 0) + sale.total;
        });
        setData(Object.entries(grouped).map(([fecha, total]) => ({ fecha, total })));
      }
    };
    fetch();
  }, [range, selectedDay]);

  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNum = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    return weekNum;
  }

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/sales`, { withCredentials: true }).then(res => {
      const days = [...new Set(res.data.map(s => new Date(s.date).toLocaleDateString()))];
      setAllDays(days);
      if (!selectedDay && days.length > 0) setSelectedDay(days[0]);
    });
  }, []); // eslint-disable-line

  return (
    <div ref={ref} id="sales-chart-capture" style={{background:"#fff", padding:8, width:600}}>
      <div style={{display: "flex", gap: 10, alignItems: "center"}}>
        <label>Ver: 
          <select value={range} onChange={e => setRange(e.target.value)} style={{marginLeft: 8}}>
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="porhora">Por hora</option>
          </select>
        </label>
        {range === "porhora" && (
          <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
            {allDays.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        )}
      </div>
      <h4>Resumen de Ventas</h4>
      <ResponsiveContainer width={560} height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#4e6cf4" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default SalesChart;
