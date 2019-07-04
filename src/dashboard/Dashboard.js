import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems } from './listItems';
import Korisnici from '../Korisnici';
import Oprema from '../Oprema';
import Button from '@material-ui/core/Button';
import Zahtjevi from '../Zahtjevi';
import { Route, withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AuthContext from '../context/authContext';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing(2),
  },
});

class Dashboard extends React.Component {

  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.menuButtonHidden,
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Evidencija laboratorijske opreme
            </Typography>
            <Button
                className={classes.button}
                style={{ color: '#fff'}}
                onClick={() => this.context.logout()}
            >
              Odjavi se
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon} style={{ display: 'flex', justifyContent: 'space-between'}}>
            {localStorage.getItem('slikaUrl') ?
                (<Avatar alt="Korisnik" src={localStorage.getItem('slikaUrl')} className={classes.bigAvatar} />)
                :
                (<Avatar className={classes.avatar} style={{ backgroundColor: '#3f51b5' }}>{`${localStorage.getItem('korisnikIme').charAt(0)}${localStorage.getItem('korisnikPrezime').charAt(0)}`}</Avatar>)
            }
            <span style={{ paddingRight: '10%' }}>{`${localStorage.getItem('korisnikIme')} ${localStorage.getItem('korisnikPrezime')}`}</span>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List><MainListItems/></List>
        </Drawer>
        <main className={classes.content}>
          <Grid
              container
              spacing={0}
              direction="column"
              alignItems="stretch"
              justify="center"
              style={{ paddingTop: '60px' }}
          >
          <Route path={`${this.props.match.url}/korisnici`} component={Korisnici}/>
          <Route path={`${this.props.match.url}/oprema`} component={Oprema}/>
            <Route path={`${this.props.match.url}/zahtjevi`} component={Zahtjevi}/>
          </Grid>
        </main>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Dashboard));
