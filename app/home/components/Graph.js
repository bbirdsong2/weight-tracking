'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import InfoIcon from '@mui/icons-material/Info';
import { ClickAwayListener, IconButton, Typography } from '@mui/material';
import MuiTooltip from '@mui/material/Tooltip';
import { useState } from 'react';

export default function Graph({
  label,
  tooltipName,
  desc,
  data,
  xAxisKey,
  dataKey,
  unit,
}) {
  const vals = data.map((d) => d[dataKey]);

  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Typography variant="h6">
        {label}
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <MuiTooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipClose}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={<Typography>{desc}</Typography>}
          >
            <IconButton onClick={handleTooltipOpen}>
              <InfoIcon />
            </IconButton>
          </MuiTooltip>
        </ClickAwayListener>
      </Typography>
      <ResponsiveContainer height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip separator=" " formatter={(v, n) => [v, tooltipName ?? n]} />
          <XAxis dataKey={xAxisKey} />
          <YAxis domain={[Math.min(...vals), Math.max(...vals)]} />
          <Line
            type="monotone"
            dataKey={dataKey}
            activeDot={{ r: 8 }}
            unit={` ${unit}`}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
