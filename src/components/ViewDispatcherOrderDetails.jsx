import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function ViewDispatcherOrderDetails({ onClose, orders }) {
  
  const order = Array.isArray(orders) ? orders[0] : orders;
  
  const calculateCompletion = (orderDetails) => {
    if (!orderDetails) return 0;
    
    let totalItems = 0;
    let completedItems = 0;
    
    const countItems = (items) => {
      if (!items || !Array.isArray(items)) return;
      items.forEach(item => {
        totalItems++;
        if (item.status === "Done") completedItems++;
      });
    };
    
    countItems(orderDetails.items);
    countItems(orderDetails.caps);
    countItems(orderDetails.boxes);
    countItems(orderDetails.pumps);
    countItems(orderDetails.decorations);
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  if (!order) {
    console.error("No order data provided to ViewDispatcherOrderDetails");
    return null;
  }

  const completionPercentage = calculateCompletion(order.order_details);

  const OrderItemTable = ({ title, items, fields }) => {
    if (!items || !items.length) return null;
    
    return (
      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 border border-gray-200 rounded-lg">
            <thead className="bg-amber-50">
              <tr>
                {fields.map((field, idx) => (
                  <th key={idx} scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {field.label}
                  </th>
                ))}
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {fields.map((field, fieldIdx) => (
                    <td key={fieldIdx} className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {field.key === 'link' ? (
                        <a href={item[field.key]} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">
                          View
                        </a>
                      ) : (
                        item[field.key]
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  // Format date if needed
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString; 
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                    Order #{order.order_number} Details
                  </DialogTitle>
                  
                  <div className="mt-4 bg-amber-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                        <p className="text-base font-semibold">{order.customer_name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
                        <p className="text-base font-semibold">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Dispatcher</h4>
                        <p className="text-base font-semibold">{order.dispatcher_name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                        <p className="text-base font-semibold">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {order.order_status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Completion Status</h4>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-amber-500 h-4 rounded-full" 
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{completionPercentage}% Complete</p>
                  </div>
                  
                  <OrderItemTable 
                    title="Items" 
                    items={order.order_details.items}
                    fields={[
                      { key: 'typeof_items', label: 'Type' },
                      { key: 'quantity', label: 'Quantity' },
                      { key: 'weight', label: 'Weight' },
                      { key: 'team', label: 'Team' }
                    ]}
                  />
                  
                  <OrderItemTable 
                    title="Caps" 
                    items={order.order_details.caps}
                    fields={[
                      { key: 'cap_name', label: 'Name' },
                      { key: 'quantity', label: 'Quantity' },
                      { key: 'cap_type', label: 'Type' },
                      { key: 'team', label: 'Team' }
                    ]}
                  />
                  
                  <OrderItemTable 
                    title="Boxes" 
                    items={order.order_details.boxes}
                    fields={[
                      { key: 'box_name', label: 'Name' },
                      { key: 'quantity', label: 'Quantity' },
                      { key: 'box_finish', label: 'Finish' },
                      { key: 'team', label: 'Team' }
                    ]}
                  />
                  
                  <OrderItemTable 
                    title="Pumps" 
                    items={order.order_details.pumps}
                    fields={[
                      { key: 'pump_name', label: 'Name' },
                      { key: 'quantity', label: 'Quantity' },
                      { key: 'team', label: 'Team' }
                    ]}
                  />
                  
                  <OrderItemTable 
                    title="Decorations" 
                    items={order.order_details.decorations}
                    fields={[
                      { key: 'decoration_name', label: 'Name' },
                      { key: 'quantity', label: 'Quantity' },
                      { key: 'link', label: 'Link' },
                      { key: 'team', label: 'Team' }
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 sm:ml-3 sm:w-auto"
                onClick={() => {
                  // Logic to complete order would go here
                  alert('Mark order as complete functionality would go here');
                }}
              >
                Complete Order
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default ViewDispatcherOrderDetails;