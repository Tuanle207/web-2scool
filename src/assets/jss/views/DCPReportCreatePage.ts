import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',

    '& .MuiGrid-container': {
      flexWrap: 'nowrap'
    }
  },
  actionGroup: {
    padding: theme.spacing(1, 4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  datagridContainer: {
    // height: '100%', 
    width: '100%',
    '& .MuiDataGrid-columnSeparator': {
      display: 'none'
    },
    '& .MuiDataGrid-colCellTitle': {
      fontWeight: 700,
    },
    '& .MuiDataGrid-root': {
      border: 'none',
      '& .MuiDataGrid-withBorder': {
        borderRight: 'none',
      }
    },
  },
  dcpReportClassFilter: {
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
    padding: theme.spacing(2), 
    borderTop: `1px solid ${theme.palette.divider}`,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    minWidth: 0,
    '&::-webkit-scrollbar': {
      display: 'none',
    }
  },
  section: {
    padding: theme.spacing(0, 1),
    '&.MuiGrid-container': {
      width: 'auto'
    }
  },
  collapseSection: {
    '&.MuiGrid-container': {
      width: 0,
      overflow: 'hidden'
    }
  },
  growSection: {
    padding: theme.spacing(0, 1),
    flex: 1,
    '&.MuiGrid-container': {
      width: 'auto'
    }
  },
  filter: {
    // marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0, 1, 1, 0),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  classesSelector: {
    width: 160,
  },
  selectedList: {
    height: 200,
    overflowX: 'auto'
  },
  selectedClassList: {
    width: '100%', 
    padding: theme.spacing(1),
    '& > li': {
      padding: 0,
      paddingRight: 16,
      // borderBottom: `1px solid ${theme.palette.grey[500]}`
      border: `1px solid ${theme.palette.grey[500]}`
    },
    '& > li:not(:last-child)': {
      borderBottomWidth: 0,
    },
    '& > li:hover': {
      borderColor: theme.palette.primary.main,
      '& p, & button': {
        // color: theme.palette.common.white,
      }
    }
  },
  selectedItem: {
    cursor: 'pointer',
    '& > p': {
      marginLeft: 20
    },
    '& *': {
      flexWrap: 'wrap !important'
    }
  },
  activeSelectedItem: {
    // borderBottomColor: `${theme.palette.primary.main} !important`,
    // borderColor: theme.palette.primary.main,
    '& p, & button': {
      color: theme.palette.primary.main
    },
  },
  removeItemBtn: {
    marginLeft: 'auto',
    '&:hover': {
      color: `${theme.palette.error.dark} !important`
    }
  },
  rulesCatSelector: {
    width: 200,
  },
  rulesSelector: {
    width: 320,
    marginLeft: theme.spacing(2)
  },
  emptySelectedList: {
    padding: theme.spacing(1, 4),
    '& > p': {
      color: theme.palette.grey[500]
    }
  },
  selectedFaultList: {
    width: '100%', 
    padding: theme.spacing(1),
    '& > li': {
      padding: 0,
      paddingRight: 16,
      border: `1px solid ${theme.palette.grey[500]}`
    },
    '& > li:not(:last-child)': {
      borderBottomWidth: 0,
    },
  },
  selectedFault: {
    padding: theme.spacing(2),
    '& > p': {
      marginLeft: 20
    },
  },
  studentContainer: {
    flexWrap: 'wrap !important' as 'wrap',
    // marginTop: theme.spacing(1)
  },
  studentChip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  studentSection: {
    marginTop: theme.spacing(1)
  },
  studentSelector: {
    width: 300,
  },
  addStudentDoneIcon: {
    color: theme.palette.success.main
  }
}));

export default useStyles;