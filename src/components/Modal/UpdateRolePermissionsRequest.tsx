import React from 'react';
import { 
  Container, 
  Tabs, 
  Tab, 
  makeStyles, 
  FormControlLabel,
  Checkbox,

 } from '@material-ui/core';
import { Identity } from '../../common/interfaces';
import { IdentityService } from '../../common/api';
import ActionModal from '.';

const useStyles = makeStyles(theme => ({
  form: {
    padding: '20px 0', 
    height: 400,
    width: 800
  },
  tabContainer: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
    '& div:not(:first-child)': {

    }
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '30ch'
  },
  tabPanelContainer: {
    width: '100%',
    padding: theme.spacing(0, 2),
    '& > p': {
      fontSize: 24,
    }
  },
  miniGroup: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowX: 'auto',
    borderTop: `1px solid ${theme.palette.divider}`
  },
  parentsPermissionItem: {

  },
  permissionItem: {
    marginLeft: 20
  }

}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const classes = useStyles();

  const { children, value, index, ...other } = props;

  return (
    <div
      className={classes.tabPanelContainer}
      role="tabpanel"
      hidden={value !== index}
      id={`permissions-tabpanel-${index}`}
      aria-labelledby={`permissions-tab-${index}`}
      {...other}
    >
      {value === index && (
        children
      )}
    </div>
  );
}

const UpdateRolePermissionsRequest = ({provider}: {provider: Identity.PermissionProvider}) => {

  const classes = useStyles();

  const [tabIndex, setTabIndex] = React.useState(0);

  const [data, setData] = React.useState<Identity.CreateUpdateRoleDto>({
    name: ''
  });
  const [ grantedPermissions, setGrantedPermissions ] = React.useState<string[]>([]);
  const [ permissionGroups, setPermissionGroups ] = React.useState<Identity.PermissionGroup[]>([]);
  const [ parentsPermissions, setParentsPermissions ] = React.useState<string[]>([]);


  React.useEffect(() => {
    const dto: Identity.UpdateRolePermissionDto = {permissions: []};

    permissionGroups.forEach(group => {
      group.permissions.forEach(permission => {
        dto.permissions.push({
          name: permission.name,
          isGranted: grantedPermissions.includes(permission.name)
        })
      })
    });
    
    ActionModal.setData({
      data: dto
    });
  }, [grantedPermissions]);


  React.useEffect(() => {
    if (provider) {
      IdentityService.getPermissions(provider).then(res => {
        const permissionGroups = res.groups;
        setPermissionGroups(permissionGroups);

        const granted: string[] = [];
        const parents: string[] = [];
        permissionGroups.forEach(group => {
          if (group.permissions.length === 1 && !parentsPermissions.includes(group.permissions[0].name)) {
            parents.push(group.permissions[0].name);
          }
          group.permissions.forEach(permission => {

            if (permission.isGranted) {
              granted.push(permission.name);
            }

            const parentName = permission.parentName;
            if ((parentName && !parents.includes(parentName))) {
              parents.push(parentName);
            }
          })
        });
        setGrantedPermissions(granted);
        setParentsPermissions(parents);
      });
    }
  }, [provider]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleCheck = (permission: Identity.Permission) =>  {
    const permissions = permissionGroups.map(group => group.permissions).flat();
    const granted = [...grantedPermissions];
    
    const index = grantedPermissions.findIndex(p => p === permission.name);
    // I. currently checked (index  >= 0) 
    if (index !== -1) {
      granted.splice(index, 1);
      // 1. parents item -> uncheck all child items
      if (parentsPermissions.includes(permission.name)) {
        permissions.forEach(p => {
          if (p.parentName === permission.name && granted.includes(p.name)) {
            const i = granted.findIndex(x => x === p.name);
            i !== -1 && granted.splice(i, 1);
          }
        });
      }
      // 2. child item -> uncheck parents if needed?
      else {
        const parentIndex = granted.findIndex(p => p === permission.parentName);
        parentIndex !== -1 && granted.splice(parentIndex, 1);
      }      
    } 
    
    // II. currently unchecked (index === -1) 
    else {
      granted.push(permission.name);
      // 1. parents item -> check all child items
      if (parentsPermissions.includes(permission.name)) {
        permissions.forEach(p => {
          if (p.parentName === permission.name && !granted.includes(p.name)) {
            granted.push(p.name);
          }
        });
      }
      // 2. child item -> check parents if needed?
      else {
        let checkParents = true;
        permissions.forEach(p => {
          if (p.parentName === permission.parentName && !granted.includes(p.name)) {
            checkParents = false;
          }
        });
        if (checkParents) {
          granted.push(permission.parentName);
        }
      }      
    }

    setGrantedPermissions(granted);
  }

  function a11yProps(index: any) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  return (
    <form className={classes.form}>
      <Container className={classes.tabContainer}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          {
            permissionGroups.map((group, groupIndex) => (
              <Tab label={group.displayName} {...a11yProps(groupIndex)} />
            ))
          }
        </Tabs>
        {
          permissionGroups.map((group, groupIndex) => {
            return (
              <TabPanel index={groupIndex} value={tabIndex}>
                <p>{group.displayName}</p>
                <div className={classes.miniGroup}>
                  {
                    group.permissions.map(permission => (
                      parentsPermissions.includes(permission.name) ?
                      (
                        <FormControlLabel
                          className={classes.parentsPermissionItem}
                          control={
                            <Checkbox
                              checked={grantedPermissions.findIndex(el => el === permission.name) !== -1}
                              onChange={() => handleCheck(permission)}
                              name={permission.name}
                              color='primary'
                            />
                          }
                          label={permission.displayName}
                        />
                      ) : (
                        <FormControlLabel
                          className={classes.permissionItem}
                          control={
                            <Checkbox
                              checked={
                                grantedPermissions.findIndex(el => el === permission.name 
                                  || el === permission.parentName) !== -1
                              }
                              onChange={() => handleCheck(permission)}
                              name={permission.name}
                              color='primary'
                            />
                          }
                          label={permission.displayName}
                        />
                      )
                    ))
                  }
                </div>
              </TabPanel>
            )
          })
        }
      </Container>
    </form>
  );
};

export default UpdateRolePermissionsRequest;