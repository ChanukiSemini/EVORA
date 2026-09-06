export const company = {
  id: 'greencharge',
  name: 'GreenCharge',
  branches: [
    {
      id: 'branch-colombo',
      name: 'Colombo',
      openHours: '24/7',
      address: '100 Galle Road, Colombo 03',
      phone: '+94 11 212 3456',
      chargers: [
        {
          id: 'charger-1',
          type: 'CCS2',
          power: '50kW-150kW',
          ports: [
            { id: 'port-1', status: 'available' },
            { id: 'port-2', status: 'occupied' },
            { id: 'port-3', status: 'available' },
          ],
        },
        {
          id: 'charger-2',
          type: 'Type2',
          power: '3.7-22kW',
          ports: [
            { id: 'port-1', status: 'available' },
            { id: 'port-2', status: 'available' },
          ],
        },
      ],
    },
    {
      id: 'branch-kandy',
      name: 'Kandy',
      openHours: '6 AM - 11 PM',
      address: '45 Peradeniya Road, Kandy',
      phone: '+94 81 223 4567',
      chargers: [
        {
          id: 'charger-1',
          type: 'CCS2',
          power: '50kW-150kW',
          ports: [{ id: 'port-1', status: 'available' }],
        },
        {
          id: 'charger-2',
          type: 'Type2',
          power: '3.7-22kW',
          ports: [
            { id: 'port-1', status: 'faulty' },
            { id: 'port-2', status: 'faulty' },
          ],
        },
        {
          id: 'charger-3',
          type: 'CHAdeMO',
          power: '50kW',
          ports: [
            { id: 'port-1', status: 'available' },
            { id: 'port-2', status: 'occupied' },
            { id: 'port-3', status: 'available' },
            { id: 'port-4', status: 'reserved' },
          ],
        },
      ],
    },
    {
      id: 'branch-galle',
      name: 'Galle',
      openHours: '24/7',
      address: '88 Matara Road, Galle',
      phone: '+94 91 224 5678',
      chargers: [
        {
          id: 'charger-1',
          type: 'CCS2',
          power: '50kW-150kW',
          ports: [
            { id: 'port-1', status: 'occupied' },
            { id: 'port-2', status: 'occupied' },
          ],
        },
        {
          id: 'charger-2',
          type: 'Type2',
          power: '3.7-22kW',
          ports: [
            { id: 'port-1', status: 'available' },
            { id: 'port-2', status: 'available' },
          ],
        },
      ],
    },
  ],
}