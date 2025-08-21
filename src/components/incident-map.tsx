'use client';

import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { config } from '@/lib/config';
import type { IncidentReport } from '@/lib/types';
import IncidentDetails from './incident-details';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useSidebar } from './ui/sidebar';

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
        <div className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${isHighSeverity ? 'bg-destructive' : 'bg-primary'}`}>
          {isHighSeverity ? <ShieldAlert className="h-6 w-6 text-destructive-foreground" /> : <ShieldCheck className="h-6 w-6 text-primary-foreground" />}
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
  const { open } = useSidebar();
  
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
        key={open ? 'sidebar-open' : 'sidebar-closed'}
        defaultCenter={defaultCenter}
        defaultZoom={12}
        mapId="echovault-map"
        className="w-full h-full"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        styles={[
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#263c3f" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }],
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }],
            },
          ]}
      >
        {incidents.map((incident) => (
          <IncidentMarker key={incident.id} incident={incident} />
        ))}
      </Map>
    </APIProvider>
  );
}