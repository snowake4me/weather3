function pageLoadDefault(){			

	var yesterayDate = new Date(new Date() - 86400000);
	var yr = yesterayDate.getFullYear();
	var mo = yesterayDate.getMonth();
	var da = yesterayDate.getDate();
	
	if(Number(mo) < 10) mo = "0" + mo;
	if(Number(da) < 10) da = "0" + da;
	
	var urlAPI = "//api.wunderground.com/api/d95017df2847b211/conditions/forecast10day/history_" + yr + mo + da + "/q/94105.json";

	$.ajax({
		type: 'GET',
		url: urlAPI,
		success: function(data) {	
		
			//Current Conditions
			$("#location").text(data.current_observation.observation_location.full);
			$("#temp_f").text(data.current_observation.temperature_string);
			$("#visibility_mi").text(data.current_observation.visibility_mi);
			$("#pressure_in").text(data.current_observation.pressure_in);
			$("#observation_time").text(data.current_observation.observation_time);
			$("#relative_humidity").text(data.current_observation.relative_humidity);
			$("#wind_string").text(data.current_observation.wind_string);
				
			var labelsForecast = [];
			var dataForecast = [];
			var labelsHistorical = [];
			var dataHistorical = [];
			var histMax, histMin;
			var foreMax, foreMin;
			
			for(var l=0; l<10; l++){
				dataForecast[l] = (data.forecast.simpleforecast.forecastday[l].high.fahrenheit);
				labelsForecast[l] = (data.forecast.simpleforecast.forecastday[l].date.month + "/" + data.forecast.simpleforecast.forecastday[l].date.day + "/" + data.forecast.simpleforecast.forecastday[l].date.year);
			}
			
			for(var l=0; l<24; l++){
				dataHistorical[l] = (data.history.observations[l].tempi);
				labelsHistorical[l] = (data.history.observations[l].date.hour + ":" + data.history.observations[l].date.min);
			}
			
			histMax = Math.max.apply(Math, dataHistorical);
			histMin = Math.min.apply(Math, dataHistorical);
			
			foreMax = Math.max.apply(Math, dataForecast);
			foreMin = Math.min.apply(Math, dataForecast);
				
			// Generate graph data
			var ctxForecast = document.getElementById("chartForecast").getContext("2d");
			ctxForecast.canvas.height = 25;
			var chartForecast = new Chart(ctxForecast , {
				responsive: 'true',
				type: 'line',
				data: { 
					labels: labelsForecast,
					datasets:[{
						label: 'Temperature (F)',
						data: dataForecast
					}]	
				},	
				options: {
					hover: {
						mode: 'label'
					},
					title: {
						display: true,
						text: '10 Day Forecast Conditions'
					}
					scales: {
						yAxes: [{
							ticks: {
								min: foreMin,
								max: foreMax
							}
						}]
					}
				}			
			});
			
			// Generate graph data
			var ctxHistorical = document.getElementById("chartHistorical").getContext("2d");
			ctxHistorical.canvas.height = 25;
			var chartHistorical = new Chart(ctxHistorical , {
				responsive: 'true',
				type: 'line',
				data: { 
					labels: labelsHistorical,
					datasets:[{
						label: 'Temperature (F)',
						data: dataHistorical
					}]	
				},	
				options: {
					hover: {
						mode: 'label'
					},
					title: {
						display: true,
						text: 'Historical Conditions (Previous Day - Hourly)'
					}
					scales: {
						yAxes: [{
							ticks: {
								min: histMin,
								max: histMax
							}
						}]
					}
				}
			});
		}
	})
}		