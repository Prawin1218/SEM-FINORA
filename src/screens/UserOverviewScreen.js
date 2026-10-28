// Admin User Overview Screen for FINORA
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius, layout } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

export const UserOverviewScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { users } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScreenHeader
        title="User Overview"
        subtitle="Manage and inspect registered demo customer accounts"
        onBack={() => navigation.goBack()}
        onOpenDrawer={() => navigation.openDrawer()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
          <TextInput
            placeholder="Search users by name, email or role..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* User Count Header */}
        <View style={styles.listHeaderRow}>
          <Text style={[styles.listTitle, { color: theme.textPrimary }]}>Registered Users</Text>
          <Text style={[styles.listCount, { color: theme.textSecondary }]}>
            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
          </Text>
        </View>

        {/* Users List Cards */}
        <View style={styles.userList}>
          {filteredUsers.map((u) => {
            const isAdminUser = u.role === 'admin';
            return (
              <TouchableOpacity
                key={u.id}
                style={[
                  styles.userCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setSelectedUser(u)}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.avatarCircle,
                    {
                      backgroundColor: theme.surfaceSecondary,
                      borderColor: isAdminUser ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text style={styles.avatarText}>{u.avatar || '👤'}</Text>
                </View>

                <View style={styles.userDetails}>
                  <View style={styles.userNameRow}>
                    <Text
                      style={[styles.userName, { color: theme.textPrimary }]}
                      numberOfLines={1}
                    >
                      {u.name}
                    </Text>
                    <View
                      style={[
                        styles.roleBadge,
                        {
                          backgroundColor: isAdminUser
                            ? (isDark ? 'rgba(255, 214, 0, 0.15)' : '#FFF9D6')
                            : theme.surfaceSecondary,
                          borderColor: isAdminUser
                            ? (isDark ? 'rgba(255, 214, 0, 0.3)' : '#FDE047')
                            : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleBadgeText,
                          {
                            color: isAdminUser
                              ? (isDark ? theme.primary : '#854D0E')
                              : theme.textSecondary,
                          },
                        ]}
                      >
                        {u.role.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[styles.userEmail, { color: theme.textSecondary }]}
                    numberOfLines={1}
                  >
                    {u.email}
                  </Text>

                  <View style={styles.userMetaRow}>
                    <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                      Joined: {u.joinedDate}
                    </Text>
                    <Text style={[styles.metaDivider, { color: theme.border }]}>•</Text>
                    <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                      Status: {u.status || 'Active'}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* User Details Modal */}
      <Modal
        visible={!!selectedUser}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedUser(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.modalAvatarContainer,
                {
                  backgroundColor: theme.surfaceSecondary,
                  borderColor: theme.primary,
                },
              ]}
            >
              <Text style={styles.modalAvatarEmoji}>
                {selectedUser?.avatar || '👤'}
              </Text>
            </View>

            <Text style={[styles.modalUserName, { color: theme.textPrimary }]}>
              {selectedUser?.name}
            </Text>
            <Text style={[styles.modalUserEmail, { color: theme.textSecondary }]}>
              {selectedUser?.email}
            </Text>

            <View style={styles.modalBadgeRow}>
              <View
                style={[
                  styles.roleBadge,
                  {
                    backgroundColor: selectedUser?.role === 'admin'
                      ? (isDark ? 'rgba(255, 214, 0, 0.15)' : '#FFF9D6')
                      : theme.surfaceSecondary,
                    borderColor: selectedUser?.role === 'admin'
                      ? (isDark ? 'rgba(255, 214, 0, 0.3)' : '#FDE047')
                      : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    {
                      color: selectedUser?.role === 'admin'
                        ? (isDark ? theme.primary : '#854D0E')
                        : theme.textSecondary,
                    },
                  ]}
                >
                  {selectedUser?.role?.toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                  {selectedUser?.status || 'Active'}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.modalDetailsList,
                {
                  backgroundColor: theme.surfaceSecondary,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.modalDetailRow}>
                <Text style={[styles.modalField, { color: theme.textSecondary }]}>Account Tier:</Text>
                <Text style={[styles.modalVal, { color: theme.textPrimary }]}>
                  {selectedUser?.accountType || 'Standard'}
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={[styles.modalField, { color: theme.textSecondary }]}>Phone Contact:</Text>
                <Text style={[styles.modalVal, { color: theme.textPrimary }]}>
                  {selectedUser?.phone || 'Not provided'}
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={[styles.modalField, { color: theme.textSecondary }]}>Registration Date:</Text>
                <Text style={[styles.modalVal, { color: theme.textPrimary }]}>{selectedUser?.joinedDate}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={[styles.modalField, { color: theme.textSecondary }]}>Total Transactions:</Text>
                <Text style={[styles.modalVal, { color: theme.textPrimary }]}>
                  {selectedUser?.totalTransactions || 0}
                </Text>
              </View>
            </View>

            <CustomButton
              title="Close Details"
              variant="secondary"
              size="md"
              onPress={() => setSelectedUser(null)}
              style={styles.modalCloseBtn}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.sm,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  listCount: {
    fontSize: typography.sizes.xs,
  },
  userList: {
    gap: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 22,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  roleBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
  userEmail: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaLabel: {
    fontSize: 10,
  },
  metaDivider: {
    marginHorizontal: 6,
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: borderRadius.lg,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalAvatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
  },
  modalAvatarEmoji: {
    fontSize: 32,
  },
  modalUserName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  modalUserEmail: {
    fontSize: typography.sizes.sm,
    marginTop: 2,
    marginBottom: 10,
  },
  modalBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
  },
  modalDetailsList: {
    width: '100%',
    borderRadius: borderRadius.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    gap: 8,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalField: {
    fontSize: typography.sizes.xs,
  },
  modalVal: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semiBold,
  },
  modalCloseBtn: {
    width: '100%',
  },
});

export default UserOverviewScreen;
