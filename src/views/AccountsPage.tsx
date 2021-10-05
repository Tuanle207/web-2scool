// import React from 'react';
// import { Container, Grid, makeStyles, IconButton, Typography } from '@material-ui/core';
// import Sidebar from '@components/Sidebar';
// import Header from '@components/Header';
// import PageTitleBar from '@components/PageTitleBar';
// import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams } from '@material-ui/data-grid';
// import { Course } from '@common/interfaces';
// import { CoursesService } from '@common/api';
// import { useFetch, usePagingInfo } from '@common/hooks';
// import DeleteIcon from '@material-ui/icons/Delete';
// import EditIcon from '@material-ui/icons/Edit';
// import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
// import { formatDate } from '@common/utils/TimeHelper';
// import { useSelectedItems } from '../hooks';
// import ActionModal from '@components/Modal';
// import CreateOrUpdateCourseRequest from '@components/Modal/CreateOrUpdateCourseRequest';
// import { comparers } from '@common/appConsts';
// import { toast } from 'react-toastify';

// const cols: GridColDef[] =  [
//   {
//     field: 'id',
//     headerName: 'Mã',
//     width: 150
//   },
//   {
//     field: 'name',
//     headerName: 'Tên khóa học',
//     width: 300
//   },
//   {
//     field: 'startTime',
//     headerName: 'Ngày bắt đầu',
//     width: 150,
//     valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value as string)
//   },
//   {
//     field: 'finishTime',
//     headerName: 'Ngày kết thúc',
//     width: 150,
//     valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value as string)
//   }
// ];

// const useStyles = makeStyles(theme => ({
//   root: {
//     height: '100%', 
//     width: '100%',
//     '& .MuiDataGrid-iconSeparator': {
//       color: theme.palette.divider,
      
//       '&:hover': {
//         color: theme.palette.common.black
//       }
//     },
//     '& .MuiDataGrid-colCell': {
//       // borderRight: '1px solid #303030',
//     },
//     '& .MuiDataGrid-colCellTitle': {
//       fontWeight: 700,
//     }
//   }
// }));

// const AccountsPage = () => {

//   const classes = useStyles();

//   const {pagingInfo, setPageIndex, setFilter} = usePagingInfo();
//   const {loading, data, error, resetCache} = useFetch(
//     CoursesService.getAllCourses, 
//     { ...pagingInfo, pageIndex: pagingInfo.pageIndex! + 1 } // DataGrid's start page count from 0, but API count from 1.
//   );
//   const {selectedItems, changeSelection} = useSelectedItems<Course.Course>();
  
//   const onPageChange = (param: GridPageChangeParams) => {
//     setPageIndex(param.page);
//   };

//   const onRequestDelete = async (courseId: string) => {
//     await CoursesService.removeCourse({courseId});
//     console.log(`Xóa khóa học ${courseId} thành công`);
//     resetCache();
//   };

//   const onRequestCreate = async (data: Course.CreateOrUpdateCourseDto) => {
//     await CoursesService.createCourse(data);
//     console.log(`Thêm khóa học thành công`);
//     resetCache();
//   };

//   const onRequestUpdate = async (data: Course.CreateOrUpdateCourseDto) => {
//     await CoursesService.updateCourse({id: getSelectedItem()!.id, data});
//     console.log(`Sửa khóa học thành công`);
//     resetCache();
//   };

//   const getSelectedItem = (): Course.Course | null => {
//     return selectedItems && selectedItems.length > 0 
//       ? selectedItems[selectedItems.length - 1] 
//       : null;
//   };

//   return (
//     <div style={{ flexGrow: 1 }}>
//       <Grid container style={{ flex: 1 }}>
//         <Grid item xs={4} sm={3} md={2}>
//           <Sidebar activeIndex={2} />
//         </Grid>
//         <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
//           <Grid item >
//             <Header onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })} />
//           </Grid>
//           <Grid item container direction='column' style={{ backgroundColor: '#DFE0EB', flexGrow: 1 }}>
//             <Grid item>
//               <PageTitleBar 
//                 title={`Tài khoản`} 
//                 onMainButtonClick={() => toast('Not implemented yet!', {type: toast.TYPE.ERROR})}
                
//               />
//               <Grid container justify='space-between' style={{padding: 10, paddingLeft: 64}}>
//                 <Grid item>
//                   <Typography variant='h6'>Danh sách khóa học</Typography>
//                 </Grid>
//                 <Grid item>
//                   <IconButton
//                     disabled={selectedItems.length === 0} 
//                     onClick={() => toast('Not implemented yet!', {type: toast.TYPE.ERROR})}
//                   >
//                     <DeleteIcon/>
//                   </IconButton>
//                   <IconButton  
//                     disabled={selectedItems.length === 0} 
//                     onClick={() => toast('Not implemented yet!', {type: toast.TYPE.ERROR})} 
//                   >
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton
//                     disabled={selectedItems.length === 0} 
//                     // onClick={} 
//                   >
//                     <ErrorOutlineIcon />
//                   </IconButton>
//                 </Grid>
//               </Grid>
//             </Grid>
//             <Grid item style={{ flexGrow: 1 }}>
//               <Container className={classes.root} style={{display: 'flex', justifyContent: 'center', justifyItems: 'center'}}>
//                 <Typography>
//                   Not implemented yet!
//                 </Typography>
//               </Container>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default AccountsPage;
export {
  
}