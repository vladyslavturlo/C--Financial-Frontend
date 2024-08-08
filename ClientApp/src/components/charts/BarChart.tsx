import React from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

type ChartProps = {
  // using `interface` is also ok
  [x: string]: any;
};
type ChartState = {
  chartData: any[];
  chartOptions: any;
};

class ColumnChart extends React.Component<ChartProps, ChartState> {
  static propTypes: {
    chartData: PropTypes.Requireable<object>;
    chartOptions: PropTypes.Requireable<object>;
  };
  constructor(props: ChartState) {
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
      <Chart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    );
  }
}

ColumnChart.propTypes = {
  chartData: PropTypes.object,
  chartOptions: PropTypes.object,
};

export default ColumnChart;
