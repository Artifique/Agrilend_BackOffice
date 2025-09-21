import React from 'react';
import { CheckCircle, XCircle, MapPin, Calendar, DollarSign, Percent } from 'lucide-react';

interface Loan {
  id: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  purpose: string;
  duration: number;
  interestRate: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'defaulted';
  requestDate: string;
  approvalDate?: string;
  dueDate?: string;
  remainingAmount: number;
  collateral: string;
  location: string;
}

interface LoanDetailsProps {
  loan: Loan;
  onClose: () => void;
  onAction: (loanId: string, action: 'approve' | 'reject') => void;
}

export default function LoanDetails({ loan, onClose, onAction }: LoanDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'active': return 'Actif';
      case 'completed': return 'Terminé';
      case 'defaulted': return 'En défaut';
      default: return status;
    }
  };

  const paymentSchedule = Array.from({ length: loan.duration }, (_, index) => ({
    month: index + 1,
    amount: Math.round((loan.amount * (1 + loan.interestRate / 100)) / loan.duration),
    dueDate: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    status: index < 2 ? 'paid' : 'pending'
  }));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Prêt #{loan.id}</h3>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan.status)}`}>
            {getStatusLabel(loan.status)}
          </span>
        </div>
        <div className="flex space-x-2">
          {loan.status === 'pending' && (
            <>
              <button
                onClick={() => onAction(loan.id, 'approve')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approuver</span>
              </button>
              <button
                onClick={() => onAction(loan.id, 'reject')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <XCircle className="h-4 w-4" />
                <span>Rejeter</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Informations du Prêt</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Montant demandé</p>
                <p className="font-medium">{loan.amount.toLocaleString()}€</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Percent className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Taux d'intérêt</p>
                <p className="font-medium">{loan.interestRate}% par an</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Durée</p>
                <p className="font-medium">{loan.duration} mois</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Localisation</p>
                <p className="font-medium">{loan.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Borrower Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Informations de l'Emprunteur</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Nom</p>
              <p className="font-medium">{loan.farmerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Objet du prêt</p>
              <p className="font-medium">{loan.purpose}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Garantie</p>
              <p className="font-medium">{loan.collateral}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date de demande</p>
              <p className="font-medium">{new Date(loan.requestDate).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Schedule */}
      {loan.status !== 'pending' && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-4">Échéancier de Remboursement</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mois
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'échéance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentSchedule.map((payment) => (
                  <tr key={payment.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Mois {payment.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.amount.toLocaleString()}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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