import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',

    '& .MuiGrid-container': {
      flexWrap: 'nowrap'
    }
  },
  actionGroup: {
    padding: theme.spacing(2, 4),
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
      },
      '.MuiDataGrid-cell:focus': {
        outlineWidth: 0
      }
    },
    overflow: 'hidden'
  },
  dcpReportAction: {
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.divider}`,
    marginTop: 8,
    borderRadius: 4,
    padding: theme.spacing(1),
  },
  acceptBtn: {
    padding: theme.spacing(1,3),
  },
  rejectBtn: {
    padding: theme.spacing(1,3),
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    }
  },
  classList: {
    width: '100%', 
    padding: theme.spacing(1),
    '& > li': {
      padding: 0,
      paddingRight: 16,
      // borderBottom: `1px solid ${theme.palette.grey[500]}`
      border: `1px solid ${theme.palette.grey[500]}`
    },
    '& > li:not(:last-child)': {
      marginBottom: theme.spacing(1)
    },
    '& > li:hover': {
      borderColor: theme.palette.primary.main,
      '& p, & button': {
      }
    }
  },
  classItem: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    '& > p': {
      marginLeft: 16,
    },
    '& *': {
      flexWrap: 'wrap !important'
    }
  },
  activeSelectedItem: {
    // borderBottomColor: `${theme.palette.primary.main} !important`,
    borderColor: `${theme.palette.primary.main} !important`,
    '& p, & button': {
      color: theme.palette.primary.main
    },
  },
  emptySelectedList: {
    padding: theme.spacing(1, 4),
    '& > p': {
      color: theme.palette.grey[500]
    }
  },
  root: {
    height: '100%', 
    width: '100%',
    '& .MuiDataGrid-root': {
      backgroundColor: '#fff',
      padding: theme.spacing(0, 2),
    },
    '& .MuiDataGrid-root *': {
      '&::-webkit-scrollbar': {
        width: 8,
        height: 8
      }
    },
    '& .MuiDataGrid-iconSeparator': {
      color: theme.palette.divider,
      
      '&:hover': {
        color: theme.palette.common.black
      }
    },
    '& .MuiDataGrid-colCell': {
      // borderRight: '1px solid #303030',
    },
    '& .MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
      outline: 'none',
    },
    '& .MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '& .MuiDataGrid-root .MuiDataGrid-cell:focus-visible': {
      outline: 'none',
    },
    '& .MuiDataGrid-colCellTitle': {
      fontWeight: 700,
    },
  },
  classRoot: {
    height: '100%', 
    '& .MuiDataGrid-root': {
      backgroundColor: '#fff',
      height: '100%',
    },
    '& .MuiDataGrid-row': {

      borderRadius: 4,
      cursor: 'pointer',
      minHeight: '0 !important',

      '& > *':  {
        userSelect: 'none',
      },
    },
    '& .MuiDataGrid-row.Mui-selected': {
      // backgroundColor: theme.palette.primary.main,
      // color: '#fff',
    },
    '& .MuiDataGrid-cell': {
      minHeight: '0 !important',
      lineHeight: '1.5 !important',
      padding: theme.spacing(1, 1),
      paddingLeft: theme.spacing(2)
    },
    '& .MuiDataGrid-root .MuiDataGrid-withBorder': {
      borderRight: 'none',
    },
    '& .MuiDataGrid-columnSeparator': {
      display: 'none',
    },
  },
  classDetail: { 
    background: '#fff', 
    height: 40, 
    marginBottom: 8, 
    borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0, 3)
  }
}));

export default useStyles;