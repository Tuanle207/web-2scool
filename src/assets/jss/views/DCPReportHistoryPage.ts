import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  actionGroup: {
    padding: theme.spacing(1, 4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  list: {
    position: "relative",
    minHeight: "100%",
    padding: '20px 100px',
    borderRadius: 4,
    marginTop: 0,
    background: theme.palette.common.white,
  },
  emptyText: {
    textAlign: 'center'
  },
  utilBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
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
  pendingStatus: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    '& > svg': {
      color: theme.palette.primary.main,
    }
  },
  approvedStatus: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    '& > svg': {
      color: theme.palette.success.main,
    }
  },
  rejectedStatus: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '& > svg': {
      color: theme.palette.error.main
    }
  }
}));

export default useStyles;