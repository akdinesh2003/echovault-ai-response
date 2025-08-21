'use client';

import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { config } from '@/lib/config';
import type { IncidentReport } from '@/lib/types';
import IncidentDetails from './incident-details';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface IncidentMapProps {
  incidents: IncidentReport[];
}

function IncidentMarker({ incident }: { incident: IncidentReport }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const isHighSeverity = (incident.severity?.score ?? 0) >= 7;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={incident.location}
        onClick={() => setInfoWindowShown(true)}
      >
        <div className={`p-2 rounded-full shadow-lg ${isHighSeverity ? 'bg-red-500' : 'bg-primary'}`}>
          {isHighSeverity ? <ShieldAlert className="h-6 w-6 text-white" /> : <ShieldCheck className="h-6 w-6 text-white" />}
        </div>
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          maxWidth={350}
          onCloseClick={() => setInfoWindowShown(false)}
        >
          <IncidentDetails incident={incident} />
        </InfoWindow>
      )}
    </>
  );
}

export default function IncidentMap({ incidents }: IncidentMapProps) {
  if (!config.googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <p className="text-center text-muted-foreground p-4">
          Google Maps API Key is not configured.
          <br />
          Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.
        </p>
      </div>
    );
  }
  
  const defaultCenter = { lat: 42.3601, lng: -71.0589 }; // Default to Boston

  return (
    <APIProvider apiKey={config.googleMapsApiKey}>
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={12}
        mapId="echovault-map"
        className="w-full h-full"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {incidents.map((incident) => (
          <IncidentMarker key={incident.id} incident={incident} />
        ))}
      </Map>
    </APIProvider>
  );
}
