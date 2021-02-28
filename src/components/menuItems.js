export default [
  {
    label: "לקוח",
    icon: "pi pi-fw pi-star",
    items: [
      { label: "מסך הבית", icon: "pi pi-fw pi-home", to: "/" },
      {
        label: "צילום תמונות ומסמכים",
        icon: "pi pi-fw pi-camera",
        to: "/iFrame_OA"
      },
      {
        label: "הזמנה חדשה",
        icon: "pi pi-fw pi-minus",
        to: "/AddOrder"
      },
      {
        label: "צפייה בתעודות משלוח",
        icon: "pi pi-fw pi-minus",
        to: "/ClientOrders"
      },
      {
        label: "גבייה",
        icon: "pi pi-fw pi-minus",
        to: "/MoneyCollection"
      }
    ]
  }
];
