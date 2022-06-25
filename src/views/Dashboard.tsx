import { useState, useEffect } from 'react';
import { Chip, Grid, Paper, Typography, Tooltip } from '@material-ui/core';
import Header from '../components/Header';
import { Util } from '../interfaces';
import { StatisticsService } from '../api';
import moment from 'moment';
import { Line, XAxis, YAxis, Tooltip as ChartToolTip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, ReferenceLine, LabelList } from 'recharts';
import { useSelector } from 'react-redux';
import TimelineIcon from '@material-ui/icons/Timeline';
import { AppConfigSelector } from '../store/selectors';
import { policies } from '../appConsts';

const list100colors = [
  '#00c49f',
  '#0088fe',
  '#ff8042',
  '#ffbb28',
  '#000000',
  '#808080',
  '#FFFF00',
  '#FF00FF',
  '#008000',
  '#800080'
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

type ViewType = 'DcpClass' | 'DcpFault';

const Dashboard = () => {

  const [ pointsChartData, setPointsChartData ] = useState<Util.IObject[]>([]);
  const [ faultsChartData, setFaultsChartData ] = useState<Util.IObject[]>([]);

  const [ viewType, setViewType ] = useState<ViewType>('DcpClass');
  const [ colors ] = useState<string[]>(list100colors);

  const grantedPolicy = useSelector(AppConfigSelector.grantedPolicies);

  useEffect(() => {
    document.title = "2Scool | Trang chủ";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (grantedPolicy[policies.Statistics]) {
      fetchDcpReportStatsData();
    }
  }, [grantedPolicy]);

  const fetchDcpReportStatsData = async () => {
    const startDate = moment().startOf('isoWeek').toDate();
    const endDate = moment().endOf('isoWeek').toDate();
    const pieChartDataPromise = StatisticsService.getStatForPieChart({
      startTime: startDate,
      endTime: endDate
    });
    const barChartDataPromise = StatisticsService.getStatForBarChart({
      startTime: startDate,
      endTime: endDate
    });
    const [ pieChartDataResult, barChartDataResult ] = await Promise.all([pieChartDataPromise, barChartDataPromise]);
    const listPieChartRawData = pieChartDataResult.items;
    const listBarChartRawData = barChartDataResult.items;

    setPointsChartData(listBarChartRawData);
    setFaultsChartData(listPieChartRawData);
  };

  const handleViewTypeChange = (viewType: any): void => {
    setViewType(viewType);
  };

  const weekDay = moment().startOf('isoWeek').format('DD/MM/YYYY');

  return (
    <Grid style={{ background: '#fff', height: "100%"}} item container direction='column'>
      <Grid item >
        <Header
          pageName="Trang chủ"
          hiddenSearchBar
        />
      </Grid>
      <Grid item container direction="column" style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', background: "#e8e8e8" }}>
        <Grid item container
          style={{
            paddingTop: 16, 
            paddingRight: 24, 
            paddingLeft: 24,
            background: "#e8e8e8"
          }}
        >
          <Paper variant="outlined" elevation={1} style={{ width: "100%" }}>
            <Grid item container direction='row' alignItems='center' style={{ padding: "5px 32px", height: 54 }}>
              <Tooltip title="Biểu đồ" style={{ marginRight: 8 }}>
                <TimelineIcon fontSize="small" />
              </Tooltip>
              {
                grantedPolicy[policies.Statistics] && (
                  <>
                    <Chip
                      clickable label='Lớp thi đua' 
                      onClick={() => handleViewTypeChange('DcpClass')}
                      variant={viewType === 'DcpClass' ? 'default' : 'outlined'} 
                      color={viewType === 'DcpClass' ? 'primary' : 'default'} style={{marginLeft: 8}}
                      />
                    <Chip clickable label='Vi phạm' 
                      onClick={() => handleViewTypeChange('DcpFault')}
                      variant={viewType === 'DcpFault' ? 'default' : 'outlined'} 
                      color={viewType === 'DcpFault' ? 'primary' : 'default'}
                      style={{marginLeft: 8}}
                    />
                  </>
                )
              }
            </Grid>
          </Paper>
        </Grid>              
        <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', background: "#e8e8e8" }}>
          <Paper elevation={3} variant="outlined" className="auto-hidden-scroll" style={{ position: 'relative', overflowX: "auto", flex: 1, minHeight: 0, margin: "16px 24px" }}>
            {
              (grantedPolicy[policies.Statistics] && viewType === 'DcpClass') && (
                <Grid container  direction="column" alignItems="center" justify="center" style={{ margin: "0 32px", width: "auto", flexWrap: 'nowrap', }}>
                  <ResponsiveContainer width={600} height={500} >
                    <BarChart
                      width={600}
                      height={400}
                      data={pointsChartData}
                      margin={{
                        top: 64,
                      }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartToolTip />
                      <Legend  />
                      <ReferenceLine y={0} stroke="#000" />
                      <Bar dataKey="points" fill={colors[0]} background={{ fill: '#eee' }} name="Điểm nề nếp">
                        <LabelList dataKey="points" position="top" />
                      </Bar>
                      <Bar dataKey="faults" fill={colors[2]} name="Lượt vi phạm" >
                        <LabelList dataKey="faults" position="top" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ paddingTop: 16, paddingBottom: 16 }}>
                    <Typography>Lớp có điểm nề nếp cao tuần {weekDay}</Typography>
                  </div>
                </Grid>
              )
            }
            
            {
              (grantedPolicy[policies.Statistics] && viewType === 'DcpFault') && (
                <Grid container direction="column" alignItems="center" justify="center" style={{  margin: "0 32px", width: "auto", flexWrap: 'nowrap', }}>
                  <ResponsiveContainer width={700} height={500}>
                    <PieChart width={700} height={500}  
                      margin={{
                          top: 36,
                          right: 36,
                          left: 36,
                          bottom: 36,
                      }}>
                      <Pie
                        dataKey="value"
                        data={faultsChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={144}
                        fill="#8884d8"
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {faultsChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={colors[index % colors.length]} 
                          />
                        ))}
                      </Pie>
                      <ChartToolTip />
                      <Legend  />
                        {
                          faultsChartData.map((el, index) => (
                            <Line 
                              key={index} 
                              type="monotone" 
                              dataKey={el.name} 
                              stroke={colors[index]} 
                              strokeWidth={2} 
                              activeDot={{ r: 8}}
                            />
                          ))
                        }
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ paddingTop: 16, paddingBottom: 16 }}>
                    <Typography>Lỗi vi phạm nhiều tuần {weekDay}</Typography>
                  </div>
                </Grid>
              )
            }
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;