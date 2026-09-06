function DonutChart({ segments, centerLabel, large }) {
  let cumulative = 0
  const gradientParts = segments.map((seg) => {
    const start = cumulative
    cumulative += seg.percent
    return `${seg.color} ${start}% ${cumulative}%`
  })

  const gradientString = `conic-gradient(${gradientParts.join(', ')})`

  return (
    <div className="donut-wrapper">
      <div className={`donut-chart ${large ? 'donut-chart-large' : ''}`} style={{ background: gradientString }}>
        <div className={`donut-hole ${large ? 'donut-hole-large' : ''}`}>
          <span>{centerLabel}</span>
        </div>
      </div>
    </div>
  )
}

export default DonutChart