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
  list: {
    // overflowY: 'scroll'
    // padding: '20px 100px' 
  },
  datagridContainer: {
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
    '& .MuiDataGrid-row.Mui-selected': {
      backgroundColor: theme.palette.primary.light,
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
    '& .MuiDataGrid-colCellMoving': {
      backgroundColor: "transparent",
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

  top1Item: {
    backgroundColor: '#18a61a',
    color: theme.palette.common.white
  },
  top2Item: {
    backgroundColor: '#81c2f7'
  },
  top3Item: {
    backgroundColor: '#e6e5fe',
  }
}));

export default useStyles;