"use client"

import { cn } from '@/lib/utils'
import InvoiceManager from '@/components/invoices/invoice-manager';
import { Toaster } from '@/components/toaster'
import Link from 'next/link'
import ExpandingArrow from '@/components/expanding-arrow'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface LineChartData {
    dates: string[] | number[];  // Adjust this type based on your actual data type
    values: number[];
  }

interface PieChartData {
    values: number[];
    labels: string[] | number[];
}

export default function DashboardPage() {
  const [lineChartData, setLineChartData] = useState<LineChartData | null>(null);
  const [pieChartData, setPieChartData] = useState<PieChartData | null>(null)

  
  useEffect(() => {
    // Fetch line chart data

    const mockLineChartData: LineChartData = {
        dates: ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01', '2023-06-01'],
        values: [1000, 1500, 1200, 1800, 2200, 2500]
    };
    
    // Mock data for pie chart
    const mockPieChartData: PieChartData = {
        values: [30, 20, 25, 15, 10],
        labels: ['Contract A', 'Contract B', 'Contract C', 'Contract D', 'Contract E']
    };
    // fetch('http://localhost:8005/line-chart-data')
    //   .then(response => response.json())
    //   .then(data => setLineChartData(data))
    //   .catch(error => console.error('Error fetching line chart data:', error))

    // // Fetch pie chart data
    // fetch('http://localhost:8005/pie-chart-data')
    //   .then(response => response.json())
    //   .then(data => setPieChartData(data))
    //   .catch(error => console.error('Error fetching pie chart data:', error))
  }, [])

  return (
    <div className="relative flex-col flex max-w-7xl w-full ">
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 pb-4 sm:space-x-4">
        <Link
          href="/invoices"
          className="group rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all"
        >
          <p>See other invoices</p>
          <ExpandingArrow />
        </Link>

        <a
          href="/dashboard"
          target="_blank"
          rel="noreferrer"
          className="mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-purple-100 px-7 py-2 transition-colors hover:bg-purple-200"
        >
          <p className="text-sm font-semibold text-purple-600">
            Dashboard 
          </p>
        </a>
      </div> 
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Visualise your contracts
      </h1>

      <div className="bg-white/30 h-full shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg w-full p-4">
        <div className="flex flex-col md:flex-row justify-between">
          {lineChartData && (
            <Plot
              data={[
                {
                  x: lineChartData.dates,
                  y: lineChartData.values,
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: {color: 'blue'},
                },
              ]}
              layout={{
                title: 'Contract Values Over Time',
                xaxis: {title: 'Date'},
                yaxis: {title: 'Value'},
                width: 500,
                height: 400,
              }}
            />
          )}
          {pieChartData && (
            <Plot
              data={[
                {
                  values: pieChartData.values,
                  labels: pieChartData.labels,
                  type: 'pie',
                },
              ]}
              layout={{
                title: 'Contract Distribution',
                width: 500,
                height: 400,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}