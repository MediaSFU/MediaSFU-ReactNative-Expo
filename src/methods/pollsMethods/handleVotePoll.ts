import { Socket } from 'socket.io-client';
import { ShowAlert } from '../../@types/types';

export interface HandleVotePollOptions {
  pollId: string;
  optionIndex: number;
  socket: Socket;
  showAlert?: ShowAlert;
  member: string;
  roomName: string;
  updateIsPollModalVisible: (isVisible: boolean) => void;
}

// Export the type definition for the function
export type HandleVotePollType = (options: HandleVotePollOptions) => Promise<void>;

/**
 * Handles the voting process for a poll.
 *
 * @param {Object} options - The options for handling the vote.
 * @param {string} options.pollId - The ID of the poll.
 * @param {number} options.optionIndex - The index of the selected option.
 * @param {Socket} options.socket - The socket instance for communication.
 * @param {Function} [options.showAlert] - Optional function to show alerts.
 * @param {Object} options.member - The member who is voting.
 * @param {string} options.roomName - The name of the room where the poll is conducted.
 * @param {Function} options.updateIsPollModalVisible - Function to update the visibility of the poll modal.
 * @returns {Promise<void>} A promise that resolves when the vote is handled.
 *
 * @throws Will log an error message if there is an issue submitting the vote.
 */
export const handleVotePoll = async ({
  pollId,
  optionIndex,
  socket,
  showAlert,
  member,
  roomName,
  updateIsPollModalVisible,
}: HandleVotePollOptions): Promise<void> => {
  try {
    socket.emit(
      'votePoll',
      {
        roomName,
        poll_id: pollId,
        member,
        choice: optionIndex,
      },
      (response: { success: boolean; reason?: string }) => {
        if (response.success) {
          showAlert?.({
            message: 'Vote submitted successfully',
            type: 'success',
          });
          updateIsPollModalVisible(false);
        } else {
          showAlert?.({ message: response.reason || 'Failed to submit vote', type: 'danger' });
        }
      },
    );
  } catch (error) {
    console.error('Error submitting vote:', error);
  }
};
