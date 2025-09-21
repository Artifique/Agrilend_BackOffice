import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, MessageCircle, Clock } from 'lucide-react';

interface Dispute {
  id: string;
  loanId: string;
  farmerName: string;
  investorName: string;
  type: 'payment' | 'quality' | 'delivery' | 'other';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  amount: number;
  description: string;
  createdDate: string;
  lastUpdate: string;
}

interface DisputeDetailsProps {
  dispute: Dispute;
  onClose: () => void;
  onAction: (disputeId: string, action: 'resolve' | 'escalate' | 'investigate') => void;
}

const mockMessages = [
  {
    id: 1,
    sender: 'Jean Kouassi',
    role: 'farmer',
    message: 'Les conditions météo ont été très défavorables cette saison, ce qui a affecté ma récolte.',
    timestamp: '2024-03-10 10:30',
    attachments: ['weather_report.pdf']
  },
  {
    id: 2,
    sender: 'Marie Diabaté',
    role: 'investor',
    message: 'Je comprends les difficultés, mais le remboursement était prévu selon les termes convenus.',
    timestamp: '2024-03-10 14:15',
    attachments: []
  },
  {
    id: 3,
    sender: 'Admin',
    role: 'admin',
    message: 'Une médiation est en cours. Nous étudions les preuves fournies.',
    timestamp: '2024-03-12 09:00',
    attachments: []
  }
];

export default function DisputeDetails({ dispute, onClose, onAction }: DisputeDetailsProps) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'payment': return 'Paiement';
      case 'quality': return 'Qualité';
      case 'delivery': return 'Livraison';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: 'Admin',
      role: 'admin' as const,
      message: newMessage,
      timestamp: new Date().toLocaleString('fr-FR'),
      attachments: []
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'investor': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Litige #{dispute.id}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dispute.status)}`}>
              {dispute.status === 'open' ? 'Ouvert' : 
               dispute.status === 'investigating' ? 'En cours' :
               dispute.status === 'resolved' ? 'Résolu' : 'Escaladé'}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(dispute.priority)}`}>
              Priorité {dispute.priority === 'high' ? 'Élevée' : 
                      dispute.priority === 'urgent' ? 'Urgent' :
                      dispute.priority === 'medium' ? 'Moyenne' : 'Faible'}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {dispute.status !== 'resolved' && (
            <>
              <button
                onClick={() => onAction(dispute.id, 'investigate')}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center space-x-2"
              >
                <Clock className="h-4 w-4" />
                <span>Enquêter</span>
              </button>
              <button
                onClick={() => onAction(dispute.id, 'resolve')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Résoudre</span>
              </button>
              <button
                onClick={() => onAction(dispute.id, 'escalate')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Escalader</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dispute Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Informations du Litige</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-gray-600">Type de litige</p>
              <p className="font-medium">{getTypeLabel(dispute.type)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Montant concerné</p>
              <p className="font-medium">{dispute.amount.toLocaleString()}€</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prêt associé</p>
              <p className="font-medium">#{dispute.loanId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date de création</p>
              <p className="font-medium">{new Date(dispute.createdDate).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dernière mise à jour</p>
              <p className="font-medium">{new Date(dispute.lastUpdate).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          <h4 className="font-medium text-gray-900 mb-4 mt-6">Parties Impliquées</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{dispute.farmerName}</p>
                <p className="text-sm text-gray-600">Agriculteur</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{dispute.investorName}</p>
                <p className="text-sm text-gray-600">Investisseur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Communication</h4>
          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{message.sender}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(message.role)}`}>
                        {message.role === 'farmer' ? 'Agriculteur' : 
                         message.role === 'investor' ? 'Investisseur' : 'Admin'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{message.message}</p>
                  {message.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.attachments.map((attachment, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {attachment}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message Form */}
          <form onSubmit={handleSendMessage} className="mt-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Envoyer</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-2">Description du Litige</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">{dispute.description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}