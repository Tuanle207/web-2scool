import { FC } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import { DataGrid, GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import { dataGridLocale } from '../../appConsts';
import { formatFullDateTime } from '../../utils/TimeHelper';

const classFaultDetailCols: GridColDef[] = [
  {
    field: 'creationTime',
    headerName: 'Thời gian báo cáo',
    width: 180,
    align: 'left',
    headerAlign: 'left',
    valueFormatter: (params: GridValueFormatterParams) => formatFullDateTime(params.value as string)
  },
  {
    field: 'regulationName',
    headerName: 'Quy định',
    width: 300,
  },
  {
    field: 'criteriaName',
    headerName: 'Tiêu chí',
    width: 250,
  },
  {
    field: 'penaltyPoints',
    headerName: 'Điểm nề nếp',
    width: 150,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'studentNames',
    headerName: 'Học sinh liên quan',
    align: 'left',
    headerAlign: 'left',
    width: 500,
  },
];

const regulationFaultDetailCols: GridColDef[] = [
  {
    field: 'creationTime',
    headerName: 'Thời gian báo cáo',
    width: 180,
    align: 'left',
    headerAlign: 'left',
    valueFormatter: (params: GridValueFormatterParams) => formatFullDateTime(params.value as string)
  },
  {
    field: 'penaltyPoints',
    headerName: 'Điểm',
    width: 120,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'className',
    headerName: 'Tên lớp',
    width: 150,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'studentNames',
    headerName: 'Học sinh liên quan',
    align: 'left',
    headerAlign: 'left',
    width: 500,
  },
];

const studentFaultDetailCols: GridColDef[] = [
  {
    field: 'creationTime',
    headerName: 'Thời gian báo cáo',
    width: 180,
    align: 'left',
    headerAlign: 'left',
    valueFormatter: (params: GridValueFormatterParams) => formatFullDateTime(params.value as string)
  },
  {
    field: 'regulationName',
    headerName: 'Quy định',
    width: 300,
  },
  {
    field: 'criteriaName',
    headerName: 'Tiêu chí',
    width: 250,
  },
  {
    field: 'penaltyPoints',
    headerName: 'Điểm',
    width: 120,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'count',
    headerName: 'Lượt chấm',
    align: 'center',
    headerAlign: 'right',
    width: 150,
  },
];

const useStyles = makeStyles(theme => ({
  datagridContainer: {
    height: '100%', 
    width: '60vw',
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
    '& .MuiDataGrid-colCellMoving': {
      backgroundColor: "transparent",
    }
  },
}));

export interface StatsDetailViewProps {
  data: any[];
  dataType: 'ClassFaultDetail' | 'RegulationFaultDetail' | 'StudentFaultDetail';
}

const StatsDetailView: FC<StatsDetailViewProps> = ({
  data,
  dataType
}) => {

  const classes = useStyles();

  return (
    <Container className={classes.datagridContainer}>
    {
      dataType === 'ClassFaultDetail' && (
      <DataGrid
        columns={classFaultDetailCols}
        rows={data}
        paginationMode='server'
        hideFooterPagination
        hideFooter
        localeText={dataGridLocale}
      />
      )
    }
    {
      dataType === 'RegulationFaultDetail' && (
      <DataGrid
        columns={regulationFaultDetailCols}
        rows={data}
        paginationMode='server'
        hideFooterPagination
        hideFooter
        localeText={dataGridLocale}
      />
      )
    }
    {
      dataType === 'StudentFaultDetail' && (
      <DataGrid
        columns={studentFaultDetailCols}
        rows={data}
        paginationMode='server'
        hideFooterPagination
        hideFooter
        localeText={dataGridLocale}
      />
      )
    }
    </Container>
  );
}

export default StatsDetailView;