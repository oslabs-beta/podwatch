# Define the chart's name
{{- define "podwatch.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

# Define the chart's fullname
{{- define "podwatch.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" $name .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

# Define the chart's labels
{{- define "podwatch.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/name: {{ include "podwatch.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- if .Values.customLabels }}
{{ toYaml .Values.customLabels | nindent 0 }}
{{- end }}
{{- end }}

# Define the chart's selector labels
{{- define "podwatch.selectorLabels" -}}
app.kubernetes.io/name: {{ include "podwatch.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
