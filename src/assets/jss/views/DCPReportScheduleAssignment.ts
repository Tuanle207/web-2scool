import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',

    '& .MuiGrid-container': {
      flexWrap: 'nowrap'
    },
    '& .MuiPaper-rounded': {
      borderRadius: 0
    }
  },
  actionGroup: {
    padding: theme.spacing(1, 4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  list: {
    // overflowY: 'scroll'
    // padding: '20px 100px' 
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
    '& .MuiDataGrid-root.MuiDataGrid-colCellMoving': {
      backgroundColor: 'inherit'
    }
  },

  dateCardContainer: {
    padding: theme.spacing(1, 2), 
    border: '1px solid #000',
    boxShadow: '2px 2px 6px #000',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white
    }
  },
  dateCardContainerActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
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
    width: 200,
  },
  studentsSelector: {
    width: 300,
    marginLeft: theme.spacing(1)
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
    '& p, & button, & svg': {
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
    width: 160,
  },
  rulesSelector: {
    width: 300,
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
  },
  gradeTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

export default useStyles;