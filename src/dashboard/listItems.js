import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import LayersIcon from '@material-ui/icons/Layers';
import { withRouter } from 'react-router-dom';

export const MainListItems = withRouter(({ match, history }) => (
  <div>
    <ListItem
        button
        onClick={() => history.push(`${match.url}/oprema`) }
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText
          primary="Oprema"
      />
    </ListItem>
    <ListItem button
              onClick={() => history.push(`${match.url}/korisnici`) }
    >
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText
          primary="Korisnici"
      />
    </ListItem>
    <ListItem
        button
        onClick={() => history.push(`${match.url}/zahtjevi`) }
    >
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Moji zahtjevi"
      />
    </ListItem>
  </div>
));
