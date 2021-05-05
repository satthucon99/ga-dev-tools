import * as React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"
import Typography from "@material-ui/core/Typography"

import { RequestStatus } from "@/types"
import { Url, StorageKey } from "@/constants"
import ExternalLink from "@/components/ExternalLink"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import { MetricsPicker, DimensionsPicker } from "@/components/GA4Pickers"
import WithHelpText from "@/components/WithHelpText"
import LinkedTextField from "@/components/LinkedTextField"
import { PAB } from "@/components/Buttons"
import PrettyJson from "@/components/PrettyJson"
import PropertyPicker from "@/components/ga4/PropertyPicker"
import OrderBys from "../OrderBys"
import MetricAggregations from "../MetricAggregations"
import DateRanges from "../DateRanges"
import { FilterType } from "../Filter"
import CohortSpec from "../CohortSpec"
import Filter from "../Filter"
import Response from "../Response"
import useMakeRequest from "./useMakeRequest"
import useInputs from "./useInputs"

const useStyles = makeStyles(theme => ({
  showRequestJSON: {
    marginLeft: theme.spacing(1),
  },
  requestJSON: {
    marginTop: theme.spacing(2),
  },
}))

const shouldCollapseRequest = ({ namespace }: any) => {
  // The number 4 refers to the number of levels to show by default, this value
  // was gotten to mostly by trial an error, but concretely it's the number of
  // unique "keys" in "object" that we want to show by default.
  // {
  //   // "reportRequests" is namespace.length === 1
  //   "reportRequests": [
  //     // "0" is namespace.length === 2
  //   {
  //     // "viewId" is namespace.length === 3
  //     "viewId": "viewIdString",
  //     // "dateRanges" is namespace.length === 3
  //     "dateRanges": [...]
  //   }]
  // }
  if (namespace.length < 4) {
    return false
  }
  return true
}

const dimensionsLink = (
  <ExternalLink href={Url.ga4RequestComposerBasicDimensions}>
    dimensions
  </ExternalLink>
)

const metricsLink = (
  <ExternalLink href={Url.ga4RequestComposerBasicMetrics}>metrics</ExternalLink>
)
const keepEmptyRowsLink = (
  <ExternalLink href={Url.ga4RequestComposerBasicKeepEmptyRows}>
    keepEmptyRows
  </ExternalLink>
)

const runReportLink = (
  <ExternalLink href={Url.ga4RequestComposerBasicRunReport}>
    properties.runReport
  </ExternalLink>
)

const dimensionFiltersLink = (
  <ExternalLink href={Url.ga4RequestComposerBasicRunReportDimensionFilter}>
    dimensionFilter
  </ExternalLink>
)

const metricFiltersLink = (
  <ExternalLink href={Url.ga4RequestComposerBasicRunReportMetricFilter}>
    metricFilter
  </ExternalLink>
)

const BasicReport = () => {
  const classes = useStyles()
  const {
    setPropertyId,
    dateRanges,
    setDateRanges,
    dimensions,
    setDimensions,
    metrics,
    setMetrics,
    showRequestJSON,
    setShowRequestJSON,
    dimensionFilter,
    setDimensionFilter,
    metricFilter,
    setMetricFilter,
    offset,
    setOffset,
    limit,
    setLimit,
    orderBys,
    setOrderBys,
    cohortSpec,
    setCohortSpec,
    keepEmptyRows,
    setKeepEmptyRows,
    metricAggregations,
    setMetricAggregations,
    addFirstSessionDate,
    propertyId,
    removeDateRanges,
    showAdvanced,
    setShowAdvanced,
  } = useInputs()
  const useMake = useMakeRequest({
    metricAggregations,
    property: propertyId,
    dimensionFilter,
    offset,
    limit,
    metricFilter,
    dateRanges,
    dimensions,
    metrics,
    orderBys,
    cohortSpec,
    keepEmptyRows,
    showAdvanced,
  })
  const {
    validRequest,
    makeRequest,
    request,
    response,
    status: requestStatus,
  } = useMake

  const metricOrDimensionSelected = React.useMemo(() => {
    return !!(
      (metrics !== undefined && metrics.length > 0) ||
      (dimensions !== undefined && dimensions.length > 0)
    )
  }, [metrics, dimensions])

  return (
    <>
      <Typography>
        Returns a customized report of your Google Analytics event data. Reports
        contain statistics derived from data collected by the Google Analytics
        measurement code. Basic Report uses the {runReportLink} API endpoint.
      </Typography>
      <Typography variant="h3">Select property</Typography>
      <PropertyPicker setPropertyId={setPropertyId} propertyId={propertyId} />
      <Typography variant="h3">Set parameters</Typography>
      <LabeledCheckbox checked={showAdvanced} setChecked={setShowAdvanced}>
        Show advanced options
      </LabeledCheckbox>
      <DateRanges
        setDateRanges={setDateRanges}
        dateRanges={dateRanges}
        showAdvanced={showAdvanced}
      />
      <MetricsPicker
        required={!metricOrDimensionSelected}
        property={propertyId}
        setMetrics={setMetrics}
        metrics={metrics}
        helperText={
          <>
            The metrics to include in the request. See {metricsLink} on devsite.
          </>
        }
      />
      <DimensionsPicker
        required={!metricOrDimensionSelected}
        property={propertyId}
        setDimensions={setDimensions}
        dimensions={dimensions}
        helperText={
          <>
            The dimensions to include in the request. See {dimensionsLink} on
            devsite.
          </>
        }
      />

      <OrderBys
        metric
        metricOptions={metrics}
        dimension
        dimensionOptions={dimensions}
        orderBys={orderBys}
        setOrderBys={setOrderBys}
      />
      <MetricAggregations
        metricAggregations={metricAggregations}
        setMetricAggregations={setMetricAggregations}
      />
      <WithHelpText
        label={showAdvanced ? "dimension filters" : "dimension filter"}
        helpText={
          <Typography>
            The {showAdvanced ? "filters" : "filter"} to use for the dimensions
            in the request. See {dimensionFiltersLink} on devsite.
          </Typography>
        }
      >
        <Filter
          showAdvanced={showAdvanced}
          storageKey={StorageKey.ga4RequestComposerBasicDimensionFilter}
          type={FilterType.Dimension}
          fields={dimensions}
          setFilterExpression={setDimensionFilter}
        />
      </WithHelpText>
      <WithHelpText
        label={showAdvanced ? "metric filters" : "metric filter"}
        helpText={
          <Typography>
            The {showAdvanced ? "filters" : "filter"} to use for the metrics in
            the request. See {metricFiltersLink} on devsite.
          </Typography>
        }
      >
        <Filter
          showAdvanced={showAdvanced}
          storageKey={StorageKey.ga4RequestComposerBasicMetricFilter}
          type={FilterType.Metric}
          fields={metrics}
          setFilterExpression={setMetricFilter}
        />
      </WithHelpText>
      <LinkedTextField
        href={Url.ga4RequestComposerBasicRunReportLimit}
        linkTitle="See limit on devsite."
        label="limit"
        value={limit}
        helperText="The maximum number of rows to return."
        onChange={setLimit}
      />
      {showAdvanced && (
        <LinkedTextField
          href={Url.ga4RequestComposerBasicRunReportOffset}
          linkTitle="See offset on devsite."
          label="offset"
          value={offset}
          helperText="The row count of the start row. The first row is row 0."
          onChange={setOffset}
        />
      )}
      {showAdvanced && (
        <CohortSpec
          cohortSpec={cohortSpec}
          setCohortSpec={setCohortSpec}
          dimensions={dimensions}
          addFirstSessionDate={addFirstSessionDate}
          dateRanges={dateRanges}
          removeDateRanges={removeDateRanges}
        />
      )}
      <WithHelpText
        helpText={
          <Typography>
            Return rows with all metrics equal to 0 separately. See{" "}
            {keepEmptyRowsLink} on devsite.
          </Typography>
        }
      >
        <LabeledCheckbox checked={keepEmptyRows} setChecked={setKeepEmptyRows}>
          keep empty rows.
        </LabeledCheckbox>
      </WithHelpText>

      <PAB onClick={makeRequest} disabled={!validRequest}>
        Make Request
      </PAB>
      <LabeledCheckbox
        className={classes.showRequestJSON}
        checked={showRequestJSON}
        setChecked={setShowRequestJSON}
      >
        Show request JSON
      </LabeledCheckbox>

      {showRequestJSON && (
        <PrettyJson
          className={classes.requestJSON}
          object={request}
          shouldCollapse={shouldCollapseRequest}
        />
      )}
      <Response
        response={response}
        error={
          useMake.status === RequestStatus.Failed ? useMake.error : undefined
        }
        requestStatus={requestStatus}
        shouldCollapse={shouldCollapseRequest}
      />
    </>
  )
}

export default BasicReport
