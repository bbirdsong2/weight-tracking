import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";
import MuiTooltip from "@mui/material/Tooltip";

export default function Graph({ label, tooltipName, desc, data, xAxisKey, dataKey, unit }) {
  const vals = data.map((d) => d[dataKey]);

  return (
    <>
      <h5 style={{ marginLeft: 10, color: "black" }}>
        {label}
        <MuiTooltip title={desc}>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </MuiTooltip>
      </h5>
      <ResponsiveContainer width="95%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip separator=" " formatter={(v, n) => [v, tooltipName ?? n]} />
          <XAxis dataKey={xAxisKey} />
          <YAxis domain={[Math.min(...vals), Math.max(...vals)]} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="blue"
            activeDot={{ r: 8 }}
            unit={` ${unit}`}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
