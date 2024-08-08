import React from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

type ChartProps = {
  // using `interface` is also ok
  [x: string]: any;
};
type ChartState = {
  chartData: any[];
  chartOptions: any;
};

class LineChart extends React.Component<ChartProps, ChartState> {
  static propTypes: {
    chartData: PropTypes.Requireable<object>;
    chartOptions: PropTypes.Requireable<object>;
  };
  constructor(props: { chartData: any[]; chartOptions: any }) {
    super(props);

    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    });
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="line"
        width="100%"
        height="100%"
      />
    );
  }
}

LineChart.propTypes = {
  chartData: PropTypes.object,
  chartOptions: PropTypes.object,
};
export default LineChart;
