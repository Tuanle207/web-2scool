import { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Util, Stats, Class } from '../interfaces';
import { StatisticsService, ClassesService } from '../api';
import moment from 'moment';
import { routes } from '../routers/routesDictionary';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { AppConfigSelector } from '../store/selectors';
import { policies } from '../appConsts';

const list100colors = [
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#00FFFF',
  '#FF00FF',
  '#808080',
  '#008000',
  '#800080'
];

const Dashboard = () => {

  const [ pointsChartData, setPointsChartData ] = useState<Util.IObject[]>([]);
  const [ faultsChartData, setFaultsChartData ] = useState<Util.IObject[]>([]);
  const [ listClass, setListClass ] = useState<Class.ClassForSimpleListDto[]>([]);
  const [ dayOfWeeks ] = useState<Map<string, number>>(new Map<string, number>([
    [ 'T2', 0 ],
    [ 'T3', 1 ],
    [ 'T4', 2 ],
    [ 'T5', 3 ],
    [ 'T6', 4 ],
    [ 'T7', 5 ],
    [ 'CN', 6 ]
  ]));

  const [ colors ] = useState<string[]>(list100colors);

  const grantedPolicy = useSelector(AppConfigSelector.grantedPolicies);

  useEffect(() => {

    const startDate = moment().startOf('isoWeek').toDate();
    const endDate = moment().endOf('isoWeek').toDate();

    const fetchData = async () => {
      const lineChartDataPromise = StatisticsService.getStatForLineChart({
        startTime: startDate,
        endTime: endDate
      });
      const listClassPromise = ClassesService.getClassForSimpleList();
      const [ lineChartDataResult, listClassResult ] = await Promise.all([lineChartDataPromise, listClassPromise]);
      const listClass = listClassResult.items; 
      const listRawData = lineChartDataResult.items;
      setListClass(listClass);
      parsePointsData(listClass, listRawData);
      parseFaultsData(listClass, listRawData);
    };

    fetchData();

    document.title = "Trang chủ";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parsePointsData = (listClass: Class.ClassForSimpleListDto[],
    rawChartData: Util.IObject<Stats.LineChartStat[]>) => {
    
    const dataLines: Util.IObject[] = [];

    Object.keys(rawChartData).forEach((dayOfWeek: string) => {
      const dayItems = rawChartData[dayOfWeek];
      const dataCol: Util.IObject = {};
      dataCol['name'] = dayOfWeek; 
      
      listClass.forEach((cl) => {
        const prevPoint = getValueOfPrevDay(cl.name, dayOfWeek, dataLines);
        const penaltyPoint = dayItems.find(x => x.classId === cl.id)?.penaltyPoint ?? 0;
        const currentPoint = prevPoint - penaltyPoint;
        dataCol[cl.name] = currentPoint;
      });

      dataLines.push(dataCol);
    });

    setPointsChartData(dataLines);
  };

  const parseFaultsData = (listClass: Class.ClassForSimpleListDto[],
    rawChartData: Util.IObject<Stats.LineChartStat[]>) => {
    
    const dataLines: Util.IObject[] = [];

    Object.keys(rawChartData).forEach((dayOfWeek: string) => {
      const dayItems = rawChartData[dayOfWeek];
      const dataCol: Util.IObject = {};
      dataCol['name'] = dayOfWeek; 
      
      listClass.forEach((cl) => {
        const prevFaults = getValueOfPrevDay(cl.name, dayOfWeek, dataLines, 0);
        const faults = dayItems.find(x => x.classId === cl.id)?.faults ?? 0;
        const currentFaults = prevFaults + faults;
        dataCol[cl.name] = currentFaults;
      });

      dataLines.push(dataCol);
    });

    setFaultsChartData(dataLines);
  };

  const getValueOfPrevDay = (className: string, currentDayOfWeek: string, 
    source: Util.IObject[], initValue: number = 100) => {
    
      const prevDay = (dayOfWeeks.get(currentDayOfWeek) ?? 0) - 1;
    if (prevDay >= 0) {
      const dayItems = source[prevDay];
      return dayItems[className];
    } else {
      return initValue;
    }
  };

  const weekDay = moment().startOf('isoWeek').format('DD/MM/YYYY');

  return (
    <div style={{ height: '100%' }}>
      <Grid container style={{ height: '100%' }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.Dashboard} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header
              pageName="Trang chủ"
              hiddenSearchBar
            />
          </Grid>
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', background: "#e8e8e8" }}>
            <Paper elevation={3} variant="outlined" style={{ height: "100%", margin: "16px 24px", overflowY: 'hidden' }}>
              {
                grantedPolicy[policies.Statistics] === true && (
                  <Grid container direction="row" justify="center" alignItems="center" style={{ height: "100%" }} >
                    <Grid item>
                      <ResponsiveContainer width={500} height={300}>
                        <LineChart
                          width={500}
                          height={300}
                          data={pointsChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 10,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {
                            listClass.map((el, index) => (
                              <Line type="monotone" dataKey={el.name} stroke={colors[index]} />
                            ))
                          }
                        </LineChart>
                      </ResponsiveContainer>
                      <Typography style={{ margin: "40px 0 40px 80px"}}>Biểu đồ nề nếp theo điểm nề nếp tuần {weekDay}</Typography>
                    </Grid>
                    <Grid item>
                      <ResponsiveContainer width={500} height={300}>
                        <LineChart
                          width={500}
                          height={300}
                          data={faultsChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 10,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {
                            listClass.map((el, index) => (
                              <Line type="monotone" dataKey={el.name} stroke={colors[index]} />
                            ))
                          }
                        </LineChart>
                      </ResponsiveContainer>
                      <Typography style={{ margin: "40px 0 40px 80px"}}>Biểu đồ nề nếp theo lượt vi phạm tuần {weekDay}</Typography>
                    </Grid>
                  </Grid>
                )
              }
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
    
  );
};

export default Dashboard;