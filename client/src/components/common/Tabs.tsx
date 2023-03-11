import React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

export default function BasicTabs({
  panels,
  tabs,
}: {
  panels: JSX.Element[]
  tabs: string[]
}): JSX.Element {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabs.map((label) => (
            <Tab label={label} key={label} />
          ))}
        </Tabs>
      </Box>
      <Box>
        {panels.map((panel, i) => (
          <TabPanel value={value} key={i} index={i}>
            {panel}
          </TabPanel>
        ))}
      </Box>
    </Box>
  )
}
