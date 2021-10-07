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
    padding: theme.spacing(2), 
    borderTop: `1px solid ${theme.palette.divider}`
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
        // color: theme.palette.common.white,
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
}));

export default useStyles;