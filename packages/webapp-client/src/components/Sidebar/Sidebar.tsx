import DataUsageOutlinedIcon from '@mui/icons-material/DataUsageOutlined';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import TokenIcon from '@mui/icons-material/Token';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import useClusters from '../../hooks/useClusters';
import { Cluster } from '../../types/Cluster';
import styles from './Sidebar.module.scss';

const drawerWidth = 240;

interface SidebarProps {
  pageName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ pageName }) => {
  const { clusters } = useClusters();

  return (
    <>
      <div className={styles.spacer}></div>
      <div className={styles.container}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              position: 'absolute',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DataUsageOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={'Overview'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HexagonOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={pageName} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemText primary={'Quick View'} />
            </ListItem>
            {clusters.map((cluster, index) => (
              <Link href={`/dashboard/${cluster.id}`}>
                <ListItem key={cluster.id} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <TokenIcon />
                    </ListItemIcon>
                    <ListItemText primary={cluster.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider sx={{ marginTop: 'auto' }} />
          <List>
            <Link href={'/cluster/create'}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <AddCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Cluster" />
                </ListItemButton>
              </ListItem>
            </Link>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </div>
    </>
  );
};

export default Sidebar;
