import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/ReportsPage.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface ReportTotals {
  registros: { total_expedientes: number }[];
  aprobados: { total_aprobado: number }[];
  rechazados: { total_rechazado: number }[];
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportTotals>({
    registros: [{ total_expedientes: 0 }],
    aprobados: [{ total_aprobado: 0 }],
    rechazados: [{ total_rechazado: 0 }],
  });

  const [filters, setFilters] = useState({
    fechaInicio: "",
    fechaFin: "",
    estado: "", // registrando | aprobado | rechazado
  });

  const loadReport = async () => {
    const res = await api.get("/reports", { params: filters });
    setReport(res.data);
  };

  useEffect(() => {
    loadReport();
  }, []);

  const totalRegistrando = report.registros[0]?.total_expedientes || 0;
  const totalApproved = report.aprobados[0]?.total_aprobado || 0;
  const totalRejected = report.rechazados[0]?.total_rechazado || 0;
  const totalCases = totalRegistrando + totalApproved + totalRejected;

  const pieData = [
    { name: "Registrando", value: totalRegistrando },
    { name: "Aprobados", value: totalApproved },
    { name: "Rechazados", value: totalRejected },
  ];

  const COLORS = ["#1a3a6b", "#28a745", "#dc3545"];

  return (
    <div className="reports-page">
      <h2>Reportes</h2>

      {/* Filters */}
      <div className="reports-filters">
        <input
          type="date"
          value={filters.fechaInicio}
          onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
        />
        <input
          type="date"
          value={filters.fechaFin}
          onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
        />
        <select
          value={filters.estado}
          onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
        >
          <option value="">Todos los estados</option>
          <option value="registrando">Registrando</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
        <button onClick={loadReport}>Aplicar filtros</button>
      </div>

      {/* Totals Cards */}
      <div className="reports-cards">
        <div className="report-card total">
          <h3>Total Casos</h3>
          <p>{totalCases}</p>
        </div>
        <div className="report-card registros">
          <h3>Registrando</h3>
          <p>{totalRegistrando}</p>
        </div>
        <div className="report-card aprobados">
          <h3>Aprobados</h3>
          <p>{totalApproved}</p>
        </div>
        <div className="report-card rechazados">
          <h3>Rechazados</h3>
          <p>{totalRejected}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="reports-pie-chart">
        <PieChart width={350} height={350}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </div>
    </div>
  );
}